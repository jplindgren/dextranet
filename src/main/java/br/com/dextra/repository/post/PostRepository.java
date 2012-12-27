package br.com.dextra.repository.post;

import java.util.ArrayList;
import java.util.Date;

import br.com.dextra.repository.document.DocumentRepository;
import br.com.dextra.utils.EntityJsonConverter;
import br.com.dextra.utils.IndexFacade;
import br.com.dextra.utils.Utils;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.SortExpression;
import com.google.appengine.api.search.SortOptions;

public class PostRepository {

	public static Iterable<Entity> buscarTodosOsPosts(int maxResults, int offSet) {

		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();
		Query query = new Query("post");

		query.addSort("dataDeAtualizacao", SortDirection.DESCENDING);
		PreparedQuery prepared = datastore.prepare(query);

		FetchOptions opts = FetchOptions.Builder.withDefaults();
		opts.limit(maxResults);
		opts.offset(offSet);

		return prepared.asIterable(opts);
	}

	public static Iterable<Entity> buscarPosts(int maxResults, String q,
			int offSet) throws EntityNotFoundException {

		SortOptions sortOptions = SortOptions.newBuilder().addSortExpression(
				SortExpression.newBuilder().setExpression("dataDeAtualizacao")
						.setDirection(SortExpression.SortDirection.DESCENDING)
						.setDefaultValueNumeric(0.0)).setLimit(1000).build();

		QueryOptions queryOptions = QueryOptions.newBuilder()
				.setFieldsToSnippet("titulo", "conteudo", "usuario")
				.setFieldsToReturn("id").setSortOptions(sortOptions).setLimit(
						maxResults).build();

		com.google.appengine.api.search.Query query = com.google.appengine.api.search.Query
				.newBuilder().setOptions(queryOptions).build(q);

		ArrayList<String> listaDeIds = EntityJsonConverter
				.toListaDeIds(IndexFacade.getIndex("post").search(query));

		ArrayList<Key> listaDeKeys = new ArrayList<Key>();
		Key key;
		for (String id : listaDeIds) {
			key = KeyFactory.createKey("post", id);
			listaDeKeys.add(key);
		}

		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		ArrayList<Entity> listaFTSResults = new ArrayList<Entity>();
		Entity e;
		for (String id : listaDeIds) {
			key = KeyFactory.createKey("post", id);
			e = datastore.get(key);
			listaFTSResults.add(e);
		}

		return listaFTSResults;
	}

	public Entity criaNovoPost(String titulo, String conteudo, String usuario) {

		String id = Utils.geraID();
		Key key = KeyFactory.createKey("post", id);
		Date data = new Date();

		return PostRepository.criaNovoPost(titulo, conteudo, usuario, id, key,
				data);
	}

	public static Entity criaNovoPost(String titulo, String conteudo,
			String usuario, String id, Key key, Date data) {

		Entity valueEntity = criaEntityPost(titulo, conteudo, usuario, id, key,
				data);

		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		datastore.put(valueEntity);

		DocumentRepository.criarDocument(titulo, conteudo, usuario, id, data);

		return valueEntity;
	}

	private static Entity criaEntityPost(String titulo, String conteudo,
			String usuario, String id, Key key, Date data) {
		Entity valueEntity = new Entity(key);
		valueEntity.setProperty("id", id);
		valueEntity.setProperty("titulo", titulo);

		valueEntity.setProperty("conteudo", new Text(conteudo));
		valueEntity.setProperty("usuario", usuario);
		valueEntity.setProperty("comentarios", 0);
		valueEntity.setProperty("likes", 0);
		valueEntity.setProperty("data", data);
		valueEntity.setProperty("dataDeAtualizacao", data);

		Date dataAtualiza = data;
		int day = (int) (Math.random() * (30 + 1));
		dataAtualiza.setDate(day);
		valueEntity.setProperty("dataDeAtualizacao", dataAtualiza);
		return valueEntity;
	}
}
