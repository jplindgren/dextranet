package br.com.dextra.dextranet.web;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import br.com.dextra.dextranet.web.post.PaginaNovoComentario;
import br.com.dextra.dextranet.web.post.PaginaNovoPost;
import br.com.dextra.teste.PaginaBase;

public class PaginaPrincipal extends PaginaBase {

	public PaginaPrincipal(WebDriver driver) {
		super(driver);
	}

	public PaginaPrincipal acesso() {
		this.navigateTo("http://localhost:8080");
		this.waitingForLoading();
		return this;
	}

	public PaginaNovoPost clicaEmNovoPost() {
		this.click("span.icon_sidebar_left_novopost");
		this.waitingForLoading();
		return new PaginaNovoPost(driver);
	}

	public PaginaNovoComentario clicaEmNovoComentario() {
		this.click("a.link");
		this.waitingForLoading();
		return new PaginaNovoComentario(driver);
	}

	public PaginaPrincipal scrollAteFim() {
		JavascriptExecutor js = (JavascriptExecutor) driver;

		// desce ate o fim do scroll
		js.executeScript("window.scrollTo(0, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, document.documentElement.clientHeight));");
		this.waitingForLoading();
		// volta o scroll para poder descer novamente
		js.executeScript("window.scrollTo(0, 500);");

		return this;
	}
}