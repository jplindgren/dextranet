dextranet.usuario = {

		nickName : "",

		autenticacao : function() {
			$.ajax( {
				type : "GET",
				url : "/s/usuario",
				success : function(usuario) {
					dextranet.usuario.nickName = usuario.nickName;
					$.holy("../template/estatico/carrega_dados_usuario.xml", usuario);
					dextranet.post.listaPost("", 0);
				}
			});
		}
}