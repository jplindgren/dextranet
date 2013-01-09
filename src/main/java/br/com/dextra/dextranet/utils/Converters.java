package br.com.dextra.dextranet.utils;

import java.util.ArrayList;
import java.util.Map.Entry;

import br.com.dextra.dextranet.post.Post;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.gson.JsonObject;

public class Converters {

	public static JsonObject toJson(Entity entity) {
        JsonObject json = new JsonObject();
        for (Entry<String, Object> entry : entity.getProperties().entrySet()) {
                json.addProperty(entry.getKey(), entry.getValue().toString());
        }
        json.addProperty("key",entity.getKey().toString());
        return json;
}

	public static ArrayList<String> toListaDeIds(Results<ScoredDocument> results) {
		ArrayList<String> idList=new ArrayList<String>();
		for (ScoredDocument scoredDocument : results) {
				idList.add(scoredDocument.getField("id").iterator().next().getText());
		}
		return idList;
	}

	public static ArrayList<String> converterListaEntities(ArrayList<Post> listaPosts) {
		ArrayList<String> stringList = new ArrayList<String>();

		for (Post post : listaPosts) {
			stringList.add(post.toJson());
		}

		return stringList;
	}

	public String converterGAETextToString(Entity entity) {
		String conteudo = ((Text) entity.getProperty("conteudo")).getValue();
		return conteudo;
	}

	public boolean toBoolean(String field) {
		if(field.equals("true"))
			return true;
		else
		return false;
	}
}
