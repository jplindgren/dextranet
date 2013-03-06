package br.com.dextra.dextranet.comment;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import junit.framework.Assert;

import org.junit.Test;
import org.owasp.validator.html.PolicyException;
import org.owasp.validator.html.ScanException;

import br.com.dextra.dextranet.post.Post;
import br.com.dextra.dextranet.post.PostRepository;
import br.com.dextra.dextranet.utils.Converters;
import br.com.dextra.teste.TesteIntegracaoBase;

import com.google.appengine.api.datastore.EntityNotFoundException;

public class CommentRepositoryTest extends TesteIntegracaoBase {

    private CommentRepository commentRepository = new CommentRepository();
    private PostRepository postRepository = new PostRepository();

    @Test
    public void criarUmComentario() {
        Comment novoComment = new Comment("Teste de Content", "marco.bordon", "123123123", false);
        commentRepository.criar(novoComment);

        Comment commentRecuperado = null;
        try {
            commentRecuperado = commentRepository.obtemPorId(novoComment.getId());
        } catch (EntityNotFoundException e) {
            Assert.fail("Post nao encontrado.");
        }

        Assert.assertEquals(novoComment.getAutor(), commentRecuperado.getAutor());
        Assert.assertEquals(novoComment.getIdPost(), commentRecuperado.getIdPost());
        Assert.assertEquals(novoComment.getText(), commentRecuperado.getText());
        Assert.assertEquals(novoComment.getDataDeCriacao(), commentRecuperado.getDataDeCriacao());
    }

    @Test
    public void criarComentarioEmUmPost() throws FileNotFoundException, InterruptedException, IOException,
            EntityNotFoundException, ParseException {

        List<Post> listaDePosts = geraPosts(6);

        Comment novoComment = new Comment("Teste de Content", "marco.bordon", listaDePosts.get(2).getId(), false);
        commentRepository.criar(novoComment);

        listaDePosts = comentaOPost(2, listaDePosts, novoComment);

        Post postRecuperado = null;
        try {
            postRecuperado = postRepository.obtemPorId(novoComment.getIdPost());
        } catch (EntityNotFoundException e) {
            Assert.fail("Post nao encontrado.");
        }

        Assert.assertEquals(novoComment.getIdPost(), postRecuperado.getId());
        Assert.assertEquals(postRecuperado.getComentarios(), 1);
        Assert.assertEquals(novoComment.getDataDeCriacao(), postRecuperado.getDataDeAtualizacao());

    }

    private List<Post> comentaOPost(int i, List<Post> listaDePosts, Comment novoComment)
            throws EntityNotFoundException, ParseException {

        listaDePosts.get(i).comentar(novoComment);
        return listaDePosts;
    }

    @Test
    public void consultarComentarioPeloIDDoPost() throws FileNotFoundException, InterruptedException, IOException,
            EntityNotFoundException, PolicyException, ScanException, ParseException {

        List<Post> listaDePosts = geraPosts(6);

        List<Comment> listaEsperada1 = comentar(listaDePosts.get(2).getId(), 2);
        List<Comment> listaEsperada2 = comentar(listaDePosts.get(4).getId(), 1);

        Assert.assertEquals(Converters.converterListaDeCommentParaListaDeJson(listaEsperada1).toString(),
                new CommentRS().consultar(listaDePosts.get(2).getId(), ""));

        Assert.assertEquals(Converters.converterListaDeCommentParaListaDeJson(listaEsperada2).toString(),
                new CommentRS().consultar(listaDePosts.get(4).getId(), ""));

    }

    @Test
    public void curtirComentario() throws FileNotFoundException, InterruptedException, IOException,
            EntityNotFoundException, ParseException {

        List<Post> postsCriados = geraPosts(4);

        List<Comment> listaDeCommentsDoPost2 = comentar(postsCriados.get(2).getId(), 1);

        listaDeCommentsDoPost2.get(0).receberCurtida("marco.bordon");
        listaDeCommentsDoPost2.get(0).receberCurtida("kaique.monteiro");

        List<Comment> listaCommentRecuperado = null;

        listaCommentRecuperado = commentRepository.listarCommentsDeUmPost(listaDeCommentsDoPost2.get(0)
                .getIdPost());

        Assert.assertEquals(2, listaCommentRecuperado.get(0).getLikes());

    }

    @Test
    public void descurtirComentario() throws FileNotFoundException, InterruptedException, IOException,
            EntityNotFoundException, ParseException {

        List<Post> postsCriados = geraPosts(4);

        List<Comment> listaDeCommentsDoPost2 = comentar(postsCriados.get(2).getId(), 1);

        listaDeCommentsDoPost2.get(0).receberCurtida("marco.bordon");
        listaDeCommentsDoPost2.get(0).receberCurtida("marco.bordon");
        listaDeCommentsDoPost2.get(0).receberCurtida("kaique.monteiro");

        List<Comment> listaCommentRecuperado = null;

        listaCommentRecuperado = commentRepository.listarCommentsDeUmPost(listaDeCommentsDoPost2.get(0)
                .getIdPost());

        Assert.assertEquals(1, listaCommentRecuperado.get(0).getLikes());

    }

    @Test
    public void consultarComentarioPeloIDDoComment() throws FileNotFoundException, InterruptedException, IOException,
            EntityNotFoundException, PolicyException, ScanException, ParseException {

        List<Post> listaDePosts = geraPosts(6);

        List<Comment> listaEsperada1 = comentar(listaDePosts.get(2).getId(), 1);

        Assert.assertEquals(Converters.converterListaDeCommentParaListaDeJson(listaEsperada1).toString(),
                new CommentRS().consultar("", listaEsperada1.get(0).getId()));

    }
}
