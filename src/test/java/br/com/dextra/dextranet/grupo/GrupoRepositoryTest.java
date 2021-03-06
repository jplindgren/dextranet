package br.com.dextra.dextranet.grupo;

import java.util.List;

import junit.framework.Assert;

import org.junit.Before;
import org.junit.Test;

import br.com.dextra.dextranet.usuario.Usuario;
import br.com.dextra.dextranet.usuario.UsuarioRepository;
import br.com.dextra.teste.TesteIntegracaoBase;

import com.google.appengine.api.datastore.EntityNotFoundException;

public class GrupoRepositoryTest extends TesteIntegracaoBase {
	private GrupoRepository repositorio = new GrupoRepository();
	private UsuarioRepository usuarioRepositorio = new UsuarioRepository();
	private Usuario usuario = new Usuario("login.google");

	@Before
	public void preparaTestes() {
		usuario = usuarioRepositorio.persiste(usuario);
	}

	@Test
	public void testaRemover() {
		Grupo grupo = new Grupo("Grupo A", "Grupo teste", usuario.getNome());
		Grupo grupoObtido = repositorio.persiste(grupo);
		repositorio.remove(grupoObtido.getId());

		try {
			repositorio.obtemPorId(grupo.getId());
		} catch (EntityNotFoundException e) {
			Assert.assertTrue(true);
		}
	}

	@Test
	public void testaInserir() throws EntityNotFoundException {
		limpaGrupoInseridos(repositorio);
		Grupo grupo = new Grupo("Grupo A", "Grupo teste", usuario.getNome());
		repositorio.persiste(grupo);
		Grupo grupoObtido = repositorio.obtemPorId(grupo.getId());
		Assert.assertEquals(grupo.getNome(), grupoObtido.getNome());
		Assert.assertEquals(grupo.getDescricao(), grupoObtido.getDescricao());
		Assert.assertEquals(grupo.getProprietario(), grupoObtido.getProprietario());
	}

	@Test
	public void testaListar() {
		limpaGrupoInseridos(repositorio);
		Grupo grupoA = new Grupo("Grupo A", "Grupo teste A", usuario.getNome());
		repositorio.persiste(grupoA);

		Grupo grupoB = new Grupo("Grupo B", "Grupo teste B", usuario.getNome());
		repositorio.persiste(grupoB);

		Grupo grupoC = new Grupo("Grupo C", "Grupo teste C", usuario.getNome());
		repositorio.persiste(grupoC);

		Grupo grupoD = new Grupo("Grupo D", "Grupo teste D", usuario.getNome());
		repositorio.persiste(grupoD);

		List<Grupo> grupos = repositorio.lista();

		Assert.assertEquals(grupos.get(0).getNome(), grupoA.getNome());
		Assert.assertEquals(grupos.get(0).getDescricao(), grupoA.getDescricao());
		Assert.assertEquals(grupos.get(0).getProprietario(), grupoA.getProprietario());

		Assert.assertEquals(grupos.get(1).getNome(), grupoB.getNome());
		Assert.assertEquals(grupos.get(1).getDescricao(), grupoB.getDescricao());
		Assert.assertEquals(grupos.get(1).getProprietario(), grupoB.getProprietario());

		Assert.assertEquals(grupos.get(2).getNome(), grupoC.getNome());
		Assert.assertEquals(grupos.get(2).getDescricao(), grupoC.getDescricao());
		Assert.assertEquals(grupos.get(2).getProprietario(), grupoC.getProprietario());
	}
}
