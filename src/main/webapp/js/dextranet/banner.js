dextranet.banner = {

		novoBanner : function() {
			console.info("NovoBanner");
			$.ajax({
				type : "GET",
				url : "/s/banner/uploadURL",
				success : function(url) {

					console.info("NovoBannerSuccess");
					$("#new_banner").attr("action", url.url).submit();
					console.info("NovoBannerSuccessURl");
				},
				error: function(){
					console.info("NovoBannerError");
					$.holy("../template/dinamico/abre_pagina_perfil.xml", {});
				}
			});
			console.info("Nem success nem error");
			return false;
		},

		listaBannersAtuais : function() {
			$('#new-banner').hide();
			$.ajax({
				type : "GET",
				url : "/s/banner",
				data : {"atuais" : "true"},
				success : function(banners) {
					alert('Sucess');
					if (banners.length > 0) {
						alert('Existe Banner');
						bannerObjectArray = postObject.getpostObjectArrayFromPostJsonArray(banners);
						$(bannerObjectArray).each(function() {
							this.postObjectJson.dataDeAtualizacao = converteData(this.postObjectJson.dataDeAtualizacao).substring(5);
						});
						$.holy("../template/dinamico/banner/banner.xml", {"jsonArrayBanner" : bannerObjectArray});
					}
				},
				error: function(){
					alert('erro');
				}

			});
			console.info("ListaBannersAtuais");
			return false;
		},

		listaBanners : function() {
			$.ajax({
				type : "GET",
				url : "/s/banner",
				data : {"atuais" : "false"},
				success : function(banners) {
					if (banners.length > 0) {
						bannerObjectArray = postObject.getpostObjectArrayFromPostJsonArray(banners);
						$(bannerObjectArray).each(function() {
							this.postObjectJson.dataInicio = converteData(this.postObjectJson.dataInicio).substring(5,15);
							this.postObjectJson.dataFim = converteData(this.postObjectJson.dataFim).substring(5,15);
							this.postObjectJson.dataDeAtualizacao = converteData(this.postObjectJson.dataDeAtualizacao).substring(5,15);
						});
						$.holy("../template/dinamico/abre_pagina_edita_banner.xml", {"jsonArrayBanner" : bannerObjectArray});
					}
				}
			});
			console.info("ListaBAnners");
		},

		editarBanner : function(idDoBanner) {
			var dados = {
					"id" : idDoBanner,
					"titulo" : $("#titulo_" + idDoBanner).val(),
					"dataInicio" : $("#dataInicio_" + idDoBanner).val(),
					"dataFim" : $("#dataFim_" + idDoBanner).val(),
					"link" : $("#bannerLink_" + idDoBanner).val()
			};

			$.ajax({
				type : "POST",
				url: "/s/banner/editar",
				data : dados,
				success : function() {
					$.ajax({
						type : "GET",
						url : "/_ah/cron"
					})
					//trocar mensagem de sucesso e colocar calendarios na pagina de edição
					$.holy("../template/dinamico/banner/mensagem_sucesso.xml", {});
				}
			});
			console.info("editarBanner");
		},

		inicializaDatepicker : function(novoBanner, dataInicio, dataFim) {
			var $dataInicio = dataInicio;
			var $dataFim = dataFim;
			var dayNamesMin = [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab" ];
			var monthNames = [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ];

			$dataInicio.datepicker({
				dateFormat: "dd/mm/yy",
				dayNamesMin: dayNamesMin,
				monthNames: monthNames,
				defaultDate: "0",
				minDate: novoBanner ? "0" : "",
				onClose: function( selectedDate ) {
					if(selectedDate != "")
						$dataFim.datepicker( "option", "minDate", selectedDate );
				}
			});

			$dataFim.datepicker({
				dateFormat: "dd/mm/yy",
				dayNamesMin: dayNamesMin,
				monthNames: monthNames,
				defaultDate: "0",
				minDate: novoBanner ? "0" : "",
				onClose: function( selectedDate ) {
					$dataInicio.datepicker( "option", "maxDate", selectedDate );
				}
			});

			if(novoBanner) {
				$dataInicio.datepicker("setDate", "Now");
				$dataFim.datepicker("setDate", "Now");
			}
		},

		ordenaBanners : function(orderBy, banners) {
			var parentUl = $(banners).parent();
			var elems = $(parentUl).children('div').remove();

			elems.sort(function(a,b) {
				var aDatePieces = $(a).find("[id^='" + orderBy + "']").text().split('/')
				var aCompleteDate = aDatePieces[2] + aDatePieces[1] + aDatePieces[0];

				var bDatePieces = $(b).find("[id^='" + orderBy + "']").text().split('/')
				var bCompleteDate = bDatePieces[2] + bDatePieces[1] + bDatePieces[0];

				return parseInt(aCompleteDate) < parseInt(bCompleteDate);
			});
			$(parentUl).append(elems);

		}
}