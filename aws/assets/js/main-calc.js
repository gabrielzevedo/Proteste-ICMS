$(window).ready(function () {
    isMobile('ready');
});

$(window).resize(function () {
   isMobile('resize');
});

//modais
$('#vertermos').click(function (e) {
    e.preventDefault();
    $('#modal').fadeIn();
});
$('#close').click(function () {
    $('#modal').fadeOut();
});
$('#close-success').click(function () {
    $('#modal-success').fadeOut();
    $("#form").addClass("closed");
    $(".cta-mobile").show();
    $('#pixel').html('');
});



$(".cta-mobile").click(function () {
    $("#form").removeClass("closed");
    $('.cta-mobile').addClass('hide');
    
});
$("#nossa-calculadora").click(function (e) {
    e.preventDefault();
    $("#form").removeClass("closed");
    $('.cta-mobile').addClass('hide');
});



$("#close-form").click(function () {
    $("#form").addClass("closed");
    $('.cta-mobile').removeClass("hide");
});



$(document).ready(function () {
    setTimeout(function() { window.scrollTo(0, 1) }, 100);

    
    //gasto-mensal
    $('#gasto-mensal').maskMoney();
    $('#gasto-mensal').blur(function() {
        var valorGasto = $(this).maskMoney('unmasked')[0];
        var strValorGastoErrorMsg = '';
        $('#gasto-erro').removeClass('active');
        if (valorGasto > 10000) {
            
            strValorGastoErrorMsg = 'O simulador considera um gasto mensal de até R$ 10.000,00.<br/>';
            $('#gasto-erro').addClass('active');
            $(this).val('');
        }
        $('#gasto-erro').html(strValorGastoErrorMsg);
    });
    
    jQuery(".tel").mask("(99) 9999-9999?9").focusout(function (event) {
        var target, phone, element;
        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
        phone = target.value.replace(/\D/g, '');
        element = $(target);
        element.unmask();
        if (phone.length > 10) {
            element.mask("(99) 99999-999?9");
        } else {
            element.mask("(99) 9999-9999?9");
        }
    });
    
});

window.addEventListener(
    'load',
    function load() {
        window.removeEventListener('load', load, false);
        document.body.classList.remove('preload');
        new WOW({mobile: false}).init();         
    },
    false);

function isMobile(tipo){
    if ($(this).width() <= 1024 && tipo == 'ready') {
       //mobile
        $("#form").addClass("closed");
    }
}



//proteste

function alertErro(){
    alert("Ocorreu um erro. Por favor, tente mais tarde.");
    document.forms[0].reset();
}

var optionListDefaultValue = '<option value=""></option>';
$("#estado").change(function () {
    //seleciona o estado
    var stateId = this.value;
    if (stateId > 0) {
        getProviders(stateId);
    } else {
        $('#empresa').prop('disabled', true);
        $('#empresa').html(optionListDefaultValue);
    }
});

function getProviders(stateId) {
    $.ajax({
        method: 'POST',
        url: '/restituicao-icms-energia/get-providers',
        data: {
            stateId: stateId
        },
        success: function (data) {
            getProvidersSuccess(data);
        },
        error: function () {
            alertErro();
           // getProvidersSuccess(data);
        }
    });
}


function getProvidersSuccess(data) {
    var optionList = optionListDefaultValue;
    
    $(data).each(function (i) {
        var option = '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
        optionList = optionList + option;
    });
    //console.log(optionList);
    $('#empresa').html(optionList);
    $('#empresa').prop('disabled', false);
}


//$('#enviar-email').click(function(e) {
//    e.preventDefault(e);
//    //ga('send', 'event', 'PullAction', 'Call Me Back', 'Pull ICMS Energia 2017');
//    var valorGasto = $('#gasto-mensal').maskMoney('unmasked')[0];
//    var idEstado = $('#estado').val();
//    var idOperadora = $('#empresa').val();
//    
//    calculoSubmit(valorGasto, idEstado, idOperadora);
//});
                         

function calculoSubmit(valorGasto, idEstado, idOperadora) {
    var fValorGasto = parseFloat(valorGasto);
    $('#enviar-email').html('Carregando...');
    $.ajax({
        method: 'POST',
        url: '/restituicao-icms-energia/simular',
        data: {
            valorGasto: fValorGasto,
            idEstado: idEstado,
            idOperadora: idOperadora
        },
        success: function(data) {
            calculoSuccess(data);
            document.forms[0].reset();
            $('#enviar-email').html('Enviar o valor por e-mail');
        },
        error: function() {
            alertErro();
        }
    });
}


function calculoSuccess(data) {
    //data.resultado
    alert(data.resultado);
    $('#modal-success').show();
    
    $("#cadastro-thank").hide();
    $("#calculo-thank").show();
}





function cadastroSubmit(nome, email, telefone, horario) {
    $.ajax({
        method: 'POST',
        url: '/restituicao-icms-energia/cadastrar',
        data: {
            name: nome,
            email: email,
            telephone: telefone,
            preferredTimeToReceiveCall: horario,
        },
        success: function() {
            $('#modal-success').show();
    
            $("#cadastro-thank").hide();
            $("#calculo-thank").show();
        },
        error: function() {
            alertErro();
        }
    });
}






















//validacoes

$(document).ready(function(){
	$("#form-me-ligue").validate({
		rules:{
			nome_cadastro:{
				required: true,
				minlength: 2
			},
			email_cadastro: {
				required: true,
				email: true
			},
            telefone: {
                required: true,
                minlength: 10
            },
            horario:{
                required: true
            },
            termos:{
                required: true
            }
		},
		messages:{
			nome_cadastro:{
				required: "O campo nome é obrigatório!",
				minlength: "Preencha com um nome válido."
			},
			email_cadastro: {
				required: "O campo e-mail é obrigatório!",
				email: "Preencha com um e-mail válido."
			},
            telefone:{
				required: "O campo telefone é obrigatório!",
				minlength: "Preencha com um telefone válido."
			},
            horario:{
				required: "Escolha um horário."
			},
            termos:{
				required: "Você deve concordar com os termos."
			}
		},
         errorPlacement: function(error, element) {
            if (element.attr("name") == "termos") {
                error.appendTo($( ".termos-erro" ));

            }
            else {
                
                if (element.attr("name") == "horario") {
                error.appendTo($( ".horario-erro" ));
            }else{
                error.insertAfter(element);
                }
            }
        },
		submitHandler: function( form ){
            
            
            
            var nome = $('#nome_cadastro').val();
            var email = $('#email_cadastro').val();
            var telefone = $('#telefone').val();
            var horario = $('#horario').val();
            
            
			cadastroSubmit(nome, email, telefone, horario);
		}
	});
    
    
    $("#form-calculo").validate({
        errorElement: 'span',
		rules:{
			gasto_mensal:{
				required: true
			},
			email: {
				required: true,
				email: true
			},
            empresa: {
                required: true
            },
            estado:{
                required: true
            }
		},
		messages:{
			gasto_mensal:{
				required: "Preencha um valor válido.",
			},
			email: {
				required: "O campo e-mail é obrigatório!",
				email: "Preencha com um e-mail válido."
			},
            empresa:{
				required: "Escolha uma empresa.",
			},
            estado:{
				required: "Escolha um estado."
			}
		},
		submitHandler: function( form ){
            //captura campos e envia formulario
			var valorGasto = $('#gasto-mensal').maskMoney('unmasked')[0];
            var idEstado = $('#estado').val();
            var idOperadora = $('#empresa').val();

            calculoSubmit(valorGasto, idEstado, idOperadora);
		}
	});
});

/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function( win ){
	var doc = win.document;
	
	// If there's a hash, or addEventListener is undefined, stop here
	if( !location.hash && win.addEventListener ){
		
		//scroll to 1
		win.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},
		
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
		
		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		}, false );
	}
})( this );

//social
var shareURL = 'https://www.proteste.org.br/energia';
var shareTitle = 'Não aceite que uma cobrança indevida te faça pagar mais caro na conta de luz!';
var shareHashtags = 'protestepeloseureembolsodeICMS';
$('.share-facebook').click(function (e) {
    e.preventDefault();
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + shareURL, 'facebookwindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 225) + ', left=' + $(window).width() / 2 + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
});
$('.share-twitter').click(function (e) {
    e.preventDefault();
    window.open('https://twitter.com/share?url=' + shareURL + '&text=' + shareTitle + '&hashtags=' + shareHashtags + '&', 'twitterwindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 225) + ', left=' + $(window).width() / 2 + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
});