var dextranet = {

		gravatarUrl : "http://www.gravatar.com/avatar/",

		processaErroNaRequisicao : function(jqXHR) {
			messageError = '(' + jqXHR.status + ' ' + jqXHR.statusText + ') ' + jqXHR.responseText;
			$('.message').message(messageError, 'error', true);
		},

		carregaMenus : function() {
			$.holy("../template/estatico/carrega_menu_principal.xml", {});
			$.holy("../template/estatico/carrega_menu_lateral.xml", {});
			$.holy("../template/estatico/carrega_miolo.xml", {});
		},
		
		buscarPosts : function() {
			var query = $('form#form_search input#form_search_input').val();
			if (!query) {
				var messageError = $.i18n.messages.post_mensagem_busca_campo_vazio; 
				$('.message').message(messageError, 'warning', true);
				return;
			}
			
			$.ajax({
				type : "GET",
				url : "/s/post/buscar",
				data : { 'query' : query },
				contentType : dextranet.application_json,
				success : function(posts) {
					if (posts.length == 0) {
						var messageError = $.i18n.messages.mensagem_nenhum_registro; 
						$('.message').message(messageError, 'warning', true);
						return;
					}
					
					$.holy("../template/dinamico/post/lista_posts.xml", { posts : posts,
						  gravatar : dextranet.gravatarUrl });
					
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				var messageError = $.i18n.messages.erro_geral_sistema;
    				$('.message').message(messageError, 'warning', true);
    			}
			});
		}
};