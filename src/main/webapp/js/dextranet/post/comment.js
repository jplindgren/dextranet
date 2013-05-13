var idUltimo = "";

dextranet.comment = {

	inicializa : function() {
		var jaTemTextArea = false;
		$(".list_stories_comments a").click(function() {
			var idDoPost = $(this).attr("id");
			if (!jaTemTextArea) {
				if (dextranet.comment.abreTelaComentario($(this).attr("id"), idDoPost)) {
					idUltimo = idDoPost;
					jaTemTextArea = true;
				}
			} else {
				$("div.esteAqui").empty();
				$("div.esteAqui").removeClass("esteAqui");
				if(idUltimo != idDoPost) {
					if (dextranet.comment.abreTelaComentario($(this).attr("id"), idDoPost)) {
						jaTemTextArea = true;
						idUltimo = idDoPost;
					}
				} else {
					jaTemTextArea = false;
				}
			}
		});
	},

	abreTelaComentario : function(idDaDivDoPost, idDoPost) {
		dextranet.comment.carregaComentario(idDoPost);
		$.holy("../template/dinamico/post/abre_pagina_novo_comment.xml", {"idDoPost" : idDoPost});

		return true;
	},

	carregaComentario : function(idDoPost) {
		$("div." + idDoPost).addClass("esteAqui");
		dextranet.comment.listaComentarios(idDoPost);
		idUltimo = idDoPost;
	},

	listaComentarios : function(idDoPost) {
		$.ajax( {
			type : 'GET',
			url : '/s/comment',
			data : {
				"idReference" : idDoPost
				},
			success : function(comments) {
					commentObjectArray = postObject.getpostObjectArrayFromPostJsonArray(comments);
					$(commentObjectArray).each(function(){
						this.postObjectJson.userLikes = dextranet.curtir.replaceDoTipsy(this.postObjectJson.userLikes);
					});
					if(commentObjectArray.length > 0)
						$.holy("../template/dinamico/post/comment.xml", {"jsonArrayComment" : commentObjectArray});
			}
		});
		return false;
	},

	comentar : function() {
		var idDoPost = $('.idClassPost').attr('id');
		var conteudo = $('#idConteudoComentario').val();

		//dextranet.home.limparAvisoPreenchaCampos();
		if (conteudo == "") {
			if (!dextranet.home.EhVisivel("#message-warning")) {
				$("#container_message_warning_comment").addClass(
						"container_message_warning");
				$.holy("../template/dinamico/post/mensagem_preencha_campos.xml",{
									"seletor" : "#container_message_warning_comment"
				});
			}
		} else {
			alert('Conteudo cheio');
			$.ajax({
				type : 'POST',
				url : '/s/comentario/' + idDoPost + '/comentar',
				data : {
					"postId" : idDoPost,
					"conteudo" : conteudo
				},
				success : function(comments) {
					dextranet.comment.limpaTelaComentario();
					dextranet.comment.carregaComentario(idDoPost);
					dextranet.post.atualizaPost(idDoPost);
				}
			});
		}
		return false;
	},

	atualizaComentario : function(idComentario) {
		$.ajax({
			type : 'GET',
			url : '/s/comment',
			data : {
				"idComment" : idComentario
				},
			success : function(comment) {
					commentObjectArray = postObject.getpostObjectArrayFromPostJsonArray(comment);
					$(commentObjectArray).each(function() {
						$("li." + idComentario + " .numero_curtida").text(this.postObjectJson.likes);
						$("li." + idComentario + " .comentario").attr("original-title", dextranet.curtir.replaceDoTipsy(this.postObjectJson.userLikes));
					});
				}
		});
	},

	limpaTelaComentario : function() {
		if (dextranet.home.EhVisivel("#message-warning"))
			$(".message").remove();
		$("#list_comments_fromPost").empty();
		CKEDITOR.instances.textarea_comment.setData("");
	}
}