function abrePaginaNovoPost()
{
	$.holy("../template/abre-pagina-novo-post.xml", {});
}

function criaNovoPost() {
	var post = {
		"title" : $("#form-input-title").val(),
		"content" : $("#form-input-content").val(),
		"author" : "usuario01"
	}
	if ((post.title == "") || (post.content == ""))
		alert("Preencha todos os campos.");
	else {
		$.ajax( {
			type : "POST",
			url : "/s/post",
			data : post,
			success : function() {
				carregaDadosHomePage2(true);
			}
		});
	}
}

function converteData(minhaData) {

	minhaData.replace("June","Jun");
	minhaData.replace("July","Jun");
	minhaData.replace("Sept","Sep");
	minhaData.replace("Tues","Tue");
	minhaData.replace("Thurs","Thu");

	var diaS = minhaData.slice(0, 3);
	var dia  = minhaData.slice(8, 10);
	var mes  = minhaData.slice(4, 7);
	var ano  = minhaData.slice(24, 28);
	var hora = minhaData.slice(10, 16);

	switch (mes) {
	case "Jan" : mes = "01"; break;
	case "Fer" : mes = "02"; break;
	case "Mar" : mes = "03"; break;
	case "Apr" : mes = "04"; break;
	case "May" : mes = "05"; break;
	case "Jun" : mes = "06"; break;
	case "Jul" : mes = "07"; break;
	case "Aug" : mes = "08"; break;
	case "Sep" : mes = "09"; break;
	case "Oct" : mes = "10"; break;
	case "Nov" : mes = "11"; break;
	case "Dec" : mes = "12"; break;
	}

	switch (diaS) {
	case "Sun" : diaS = "dom"; break;
	case "Mon" : diaS = "seg"; break;
	case "Tue" : diaS = "ter"; break;
	case "Wed" : diaS = "qua"; break;
	case "Thu" : diaS = "qui"; break;
	case "Fri" : diaS = "sex"; break;
	case "Sat" : diaS = "sab"; break;
	}

	return diaS + ", " + dia + "/" + mes + "/" + ano + " - " + hora;
}