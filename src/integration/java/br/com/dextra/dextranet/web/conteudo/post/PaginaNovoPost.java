package br.com.dextra.dextranet.web.conteudo.post;

import org.openqa.selenium.WebDriver;

import br.com.dextra.dextranet.PaginaBase;

public class PaginaNovoPost extends PaginaBase {

	public PaginaNovoPost(WebDriver driver) {
		super(driver);
	}

	public PaginaNovoPost redigeConteudoDoPost(String titulo, String conteudo) {
		this.writeInputText("input#form_input_title", titulo);
		this.writeCKEditor(conteudo, "form_input_content");

		return this;
	}

	public void submetePost() {
		this.click("button#form_post_submit");
		this.waitingForLoading();
	}

	public void criarNovoPost(String titulo, String conteudo) {
		this.redigeConteudoDoPost(titulo, conteudo);
		this.submetePost();
	}

}