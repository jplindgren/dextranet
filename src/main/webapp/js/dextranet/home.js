dextranet.home = {

	inicializa : function() {
		consulta.setText("");
		dextranet.paginacao.resetPaginacao();
		dextranet.home.carregueOsTemplates();
		dextranet.usuario.autenticacao();
	},

	carregueOsTemplates : function() {
		$.holy("../template/estatico/carrega_menu_principal.xml", {});
		$.holy("../template/estatico/carrega_menu_lateral.xml", {});
		$.holy("../template/dinamico/carrega_miolo_home_page.xml", {});
	},

	carregaHome : function() {
		dextranet.home.limpaPosts();
		dextranet.home.limpaContentPrincipal();
		dextranet.home.setActiveMenuLateral("#sidebar_left_home");
		dextranet.post.listaPost("", 0);
	},

	setActiveMenuLateral : function(id) {
		$("#sidebar_left_menu > li").removeClass('active');
		$(id).addClass("active");
	},

	abrePopUpNovoPost : function() {		
	
		$('#sidebar_left_new_post').click(function(e) {
			e.stopPropagation();
		});
	
		function closePostPopup()
		{
			$.DextranetInterface.hideContentMainOverlay();
			$(".sidebar_show_right.post").hide();
			dextranet.home.setActiveMenuLateral('#' + $antigo.attr('id'));
		}
	
		if (dextranet.home.EhVisivel('.sidebar_show_right.post')){
			closePostPopup();
		} 
		
		else {
			dextranet.home.limparAvisoPreenchaCampos();
			$(".sidebar_show_right.post").show();
			$.DextranetInterface.showContentMainOverlay();
			$antigo = $('#sidebar_left_menu li.active');
			dextranet.home.setActiveMenuLateral("#sidebar_left_new_post");

			$(document).keydown(function(e)	{
				if ( e.which === 27 ) {
					e.preventDefault();
					closePostPopup();
					$(this).unbind('keydown');
					$("#button_sidebar_left_novopost").focus();
				}
			});
			
			$('body').click(function() {
				$(this).unbind('click');
				closePostPopup();
			});
			
			$('#form_input_title').focus();
		}
	},

	abrePaginaNovoBanner : function() {
		dextranet.home.limpaPosts();
		$.holy("../template/dinamico/abre_pagina_novo_banner.xml", {});
		dextranet.home.setActiveMenuLateral("#sidebar_left_new_banner");
	},

	abrePaginaPerfil : function() {
		dextranet.home.limpaPosts();
		dextranet.perfil.obter(dextranet.usuario.id);
//		dextranet.perfil.init(dextranet.usuario.id);
//		$.holy("../template/dinamico/abre_pagina_perfil.xml", {});
		dextranet.home.setActiveMenuLateral("#sidebar_left_profile");
	},

	abrePaginaEquipe : function() {
		dextranet.home.limpaPosts();
		dextranet.equipe.get();
		//$.holy("../template/dinamico/abre_pagina_equipe.xml", {});
		dextranet.home.setActiveMenuLateral("#sidebar_left_team");
	},

	abrirOuFecharTelaUsuario : function() {
		if (dextranet.home.EhVisivel('#box_user_profile')){
			dextranet.home.abrirTelaUsuario();
		} else {
			dextranet.home.fecharTelaUsuario();
		}
	},

	abrirTelaUsuario : function() {
		$("#box_user_profile").css("display", "none");
		$("#box_user_info .shape_arrow_down").css("display", "none");
		$("#box_user_info .shape_arrow_right").css("display", "inline-block");
	},

	fecharTelaUsuario : function() {
		$("#box_user_profile").css("display", "block");
		$("#box_user_info .shape_arrow_down").css("display", "inline-block");
		$("#box_user_info .shape_arrow_right").css("display", "none");

		if ($('#box_user_notifications_full').is(':visible'))
			$("#box_user_notifications_full").css("display", "none");
	},

	abrirOuFecharTelaNotificacoes : function() {
		if (dextranet.home.EhVisivel('#box_user_notifications_full')) {
			dextranet.home.someODisplayDeNotificacao();
		} else {
			dextranet.home.apareceODisplayDeNotificacao();
		}
	},

	EhVisivel : function(element){
		return $(element).is(':visible');
	},

	someODisplayDeNotificacao : function() {
		$("#box_user_notifications_full").css("display", "none");
	},

	apareceODisplayDeNotificacao : function() {
		$("#box_user_notifications_full").css("display", "block");

		if ($('#box_user_profile').is(':visible')) {
			dextranet.home.abrirTelaUsuario();
		}
	},

	limparAvisoPreenchaCampos : function() {
		if(dextranet.home.EhVisivel("div.container_message_warning")) {
			$("div.container_message_warning").empty();
			$("div.container_message_warning").removeClass("container_message_warning");
		}
	},

	limpaPosts : function() {
		$("ul#relacao_dos_posts").empty();
	},

	limpaContentPrincipal : function() {
		$("div#content_principal").empty();
	}
};
