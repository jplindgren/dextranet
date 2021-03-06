dextranet.post = {

		foundPosts : [],

		novo : function() {
			$.holy("../template/dinamico/post/novo_post.xml", {});
			dextranet.ativaMenu("sidebar_left_new_post");
		},

		postar : function() {
			// validacao feita manualmente em funcao do CKEDITOR
			var titulo = $('#form_new_post input#form_input_title').val();
			var tituloLimpo = stringUtils.removeCaracteresEspeciais(titulo);
			var conteudo = CKEDITOR.instances.form_input_content.getData();
			var conteudoLimpo = stringUtils.removeCaracteresEspeciais(conteudo);

			if (tituloLimpo != "" && conteudoLimpo != "") {
				$.ajax( {
					type : "POST",
					url : "/s/post/",
					data : { 'titulo' : titulo, 'conteudo' : conteudo },
					success : function() {
						$('.message').message($.i18n.messages.post_mensagem_postagem_sucesso, 'success', true);
						dextranet.post.listar(1);
					},
	    			error: function(jqXHR, textStatus, errorThrown) {
	    				dextranet.processaErroNaRequisicao(jqXHR);
	    			}
				});
			} else {
				$('.message').message($.i18n.messages.post_erro_campos_obrigatorios, 'error', true);
			}
		},

		listar : function(pagina) {
			if (pagina == 1) {
				dextranet.post.foundPosts = [];
				dextranet.paginacao.paginaCorrente = 1;
			}
			if (!pagina) {
				var pagina = 1;
			}


			$.ajax( {
				type : "GET",
				loading : false,
				url : "/s/post?p="+pagina,
				contentType : dextranet.application_json,
				success : function(posts) {
					if(posts != null && posts.length > 0){
						dextranet.post.foundPosts = dextranet.post.foundPosts.concat(posts);
					}

					$.ajax({
			            url : "../template/dinamico/post/lista_posts.xml",
			            loading : false,
			            dataType : 'holy',
			            context : { paginar : posts.length > 0,
			                posts : dextranet.post.foundPosts,
			                gravatar : dextranet.gravatarUrl}
					});

					dextranet.ativaMenu("sidebar_left_home");
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

		conteudoParaExibicao : function(conteudo) {
			var conteudoLimpo = stringUtils.removeTagHTML(conteudo);

			if (conteudoLimpo.length > 200) {
				conteudoLimpo = conteudoLimpo.substring(0, 199);

				//Verifica se a ultima palavra tem a acentuação quebrada
				var ultimaPalavra = conteudoLimpo.lastIndexOf(" ");
				var indiceUltimaPalavra = ultimaPalavra;

				ultimaPalavra = conteudoLimpo.substring(ultimaPalavra);

				if(ultimaPalavra.lastIndexOf("&") != -1){
					conteudoLimpo = conteudoLimpo.substring(indiceUltimaPalavra, -1);
				}
				conteudoLimpo = conteudoLimpo + " (...)";
			}

			return conteudoLimpo;
		},

		curtir : function(postId) {
			$.ajax( {
				type : "POST",
				loading : false,
				url : "/s/post/" + postId + "/curtida",
				contentType : dextranet.application_json,
				success : function(qtdCurtidas) {
					$("div.list_stories_data a#showLikes_" + postId + " span.numero_curtida").text(qtdCurtidas);
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

		descurtir : function(postId) {
			$.ajax( {
				type : "DELETE",
				loading : false,
				url : "/s/post/" + postId + "/descurtida",
				contentType : dextranet.application_json,
				success : function(qtdCurtidas) {
					$("div.list_stories_data a#showLikes_" + postId + " span.numero_curtida").text(qtdCurtidas);
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

		curtido : function(postId) {
			var curtiu;
			$.ajax( {
				type : "GET",
				loading : false,
				url : "/s/post/" + postId + "/curtido",
				contentType : dextranet.application_json,
				async : false,
				success : function(usuarioCurtiu) {
					curtiu = usuarioCurtiu;
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});

			return curtiu;
		},

		curtirDescurtir : function (postId) {
			var curtiu = dextranet.post.curtido(postId);
			if (!curtiu) {
				$("#like_" + postId + " #desfazer").html($.i18n.messages.desfazer);
				dextranet.post.curtir(postId);
			} else {
				$("#like_" + postId + " #desfazer").html("");
				dextranet.post.descurtir(postId);
			}
		},

		listarCurtidas : function(postId) {
			$.ajax( {
				type : "GET",
				url : "/s/post/"+postId+"/curtida",
				contentType : dextranet.application_json,
				success : function(curtidas) {
					$.holy("../template/dinamico/post/lista_curtidas.xml", { curtidas : curtidas, gravatar : dextranet.gravatarUrl });
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

		remover : function(postId) {
			$.ajax( {
				type : "DELETE",
				url : "/s/post/"+postId,
				contentType : dextranet.application_json,
				success : function() {
					$('li#'+postId).slideUp(function(){
						$(this).remove();
						dextranet.post.listar(1);
					});
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

		// Comentarios
		comentar : function(idPost) {
			var conteudo = $('#' + idPost + ' .idConteudoComentario').val();
			if (conteudo != "") {
				$.ajax({
					type : 'POST',
					url : '/s/post/' + idPost + '/comentario',
					async: false,
					data : {
						"conteudo" : conteudo
					},
					success : function(comentario) {
						$.holy("../template/dinamico/post/novo_comentario.xml", {postId : idPost,
																				comentario : comentario,
																				gravatar : dextranet.gravatarUrl});
						dextranet.post.limpaCampoComentario(idPost);
						$total_comentarios = $('a.' + idPost + ' span.numero_comentario');
						$total_comentarios.text(parseInt($total_comentarios.text())+1);

						$.ajax( {
							type : "GET",
							url : "/s/post?p=1&r="+dextranet.post.foundPosts.length,
							contentType : dextranet.application_json,
							success : function(posts) {
								dextranet.post.foundPosts = posts;
							},
			    			error: function(jqXHR, textStatus, errorThrown) {
			    				dextranet.processaErroNaRequisicao(jqXHR);
			    			}
						});
					}
				});
			} else {
				$('.message').message($.i18n.messages.erro_campos_obrigatorios, 'error', true);
			}
			return false;
		},

		limpaCampoComentario : function(postId) {
			if ($('#' + postId + ' .idConteudoComentario').val() != "") {
				$('#' + postId + ' .idConteudoComentario').val("")
			}
		},


		removerComentario : function(postId, comentarioId) {
			$.ajax( {
				type : "DELETE",
				url : "/s/post/"+comentarioId+"/comentario",
				contentType : dextranet.application_json,
				success : function() {
					$('li#'+postId+' ul.list_stories_comments' + ' li#'+comentarioId).slideUp(function(){
						$(this).remove();
						$total_comentarios = $('a.' + postId + ' span.numero_comentario');
						$total_comentarios.text(parseInt($total_comentarios.text())-1);
					});
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

		curtirComentario : function(postId, comentarioId) {
			$.ajax( {
				type : "POST",
				loading : false,
				url : "/s/post/"+postId+"/"+comentarioId+"/curtida",
				contentType : dextranet.application_json,
				success : function(qtdCurtidas) {
					$("a#showLikes_"+comentarioId+" span.numero_curtida").text(qtdCurtidas.quantidadeDeCurtidas);
				}
			});
		},

		listarCurtidasComentario : function(postId, comentarioId) {
			$.ajax( {
				type : "GET",
				url : "/s/post/"+postId+"/"+comentarioId+"/curtida",
				contentType : dextranet.application_json,
				success : function(curtidas) {
					$.holy("../template/dinamico/post/lista_curtidas.xml", { curtidas : curtidas, gravatar : dextranet.gravatarUrl });
				},
    			error: function(jqXHR, textStatus, errorThrown) {
    				dextranet.processaErroNaRequisicao(jqXHR);
    			}
			});
		},

	}