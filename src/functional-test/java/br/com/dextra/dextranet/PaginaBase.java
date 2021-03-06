package br.com.dextra.dextranet;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import br.com.dextra.expertus.page.PageObject;
import br.com.dextra.expertus.page.TimedOutException;

public class PaginaBase extends PageObject {

	public PaginaBase(WebDriver driver) {
		super(driver);
	}

	public void redigeCKEditor(String conteudo, String form) {
		((JavascriptExecutor) driver).executeScript("CKEDITOR.instances." + form + ".setData(\"" + conteudo + "\");");
	}

	public void redigeConteudoTextArea(String text, String idTextArea) {
		String textarea = "textarea#" + idTextArea;
		this.writeTextArea(textarea, text);
	}

	public void redigeTextoInput(String texto, String idInput) {
		String input = "input#" + idInput;
		this.writeInputText(input, texto);
	}

	public void waitingForLoading() {
		String loadingCssSeletor = "div.loading";

		// faz um sleep inicial para o carregando aparecer
		this.waitToLoad(TIME_TO_WAIT);
		int tentativas = 1;

		while (tentativas < MAX_ATTEMPT_TO_WAIT) {
			boolean loadingAtivo = Boolean.valueOf(this.getElementAttribute(loadingCssSeletor, "active"));
			if (!loadingAtivo) {
				break;
			}
			tentativas++;
			this.waitToLoad(TIME_TO_WAIT);
		}

		if (tentativas >= MAX_ATTEMPT_TO_WAIT) {
			throw new TimedOutException(loadingCssSeletor + " nao desapareceu no tempo esperado.");
		}
	}

}
