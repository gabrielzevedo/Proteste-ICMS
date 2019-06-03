$(window).ready(function () {
    isMobile('ready');
    
});

//    $(document).ready(function(){
//
//    /* Get browser */
//    $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
//
//    /* Detect Chrome */
//    if($.browser.chrome){
//        /* Do something for Chrome at this point */
//        //alert("You are using Chrome!");
//        
//        /* Finally, if it is Chrome then jQuery thinks it's
//           Safari so we have to tell it isn't */
//        $.browser.safari = false;
//    }
//
//    /* Detect Safari */
//    if($.browser.safari){
//        /* Do something for Safari */
//        //alert("You are using Safari!");
//        $(".parallax-bg").css("display", "none");
//        $("body").addClass("isSafari");
//    }
//
//});

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
    fecharModalSucesso();
});
$("#close-form").click(function () {
    $("#form").addClass("closed");
    $('.cta-mobile').removeClass("hide");
});
//$('#reaver-dinheiro').click(function () {
//    fecharModalSucesso();
//});

function fecharModalSucesso(){
    $('#modal-success').fadeOut();
    $("#form").addClass("closed");
    $(".cta-mobile").removeClass("hide");
    $('#pixel').html('');
}

$(".cta-mobile").click(function () {
    $("#form").removeClass("closed");
    $('.cta-mobile').addClass('hide');
    
});
$("#nossa-calculadora").click(function (e) {
    e.preventDefault();
    $('#form').animateCss('pulse');
    isMobile("nossa-calculadora"); //desativa animação se for mobile e abre form
});

//detect animate css end
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});






$(document).ready(function () {
    
    
    var ua = navigator.userAgent.toLowerCase(); 
if (ua.indexOf('safari') != -1) { 
  if (ua.indexOf('chrome') > -1) {
    console.log("chrome") // Chrome
  } else {
    console.log("safari") // Safari
      $(".parallax-bg").css("display", "none");
        $("body").addClass("isSafari");
  }
}
    
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

    if ($(this).width() <= 1024 && tipo == 'nossa-calculadora') {
        //mobile
        $('#form').removeClass('animated pulse');
        $("#form").removeClass("closed");
        $('.cta-mobile').addClass('hide');
    }
}



//proteste

function alertErro(){
    alert("Ocorreu um erro. Por favor, tente mais tarde.");
    document.forms[0].reset();
    $('#empresa').prop('disabled', true);
    $('#empresa').html('<option value=""></option>');
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

var header = {
        "ApiId": 'E5C0DC99-776B-4A16-9B8A-B5FB68C2ED72',
    };

$('#empresa').html('<option>Carregando...</option>');
    $.ajax({
        method: 'POST',
	crossDomain: true,
	header: header,
    // url: 'http://www.proteste.org.br/restituicao-icms-energia/get-providers',
	url: '/Api/CorePT/getProviders',

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
    var optionList = '<option value="">Selecione uma empresa</option>';
    
   // data = JSON.parse(data);

    $(data).each(function (i) {
        var option = '<option value="' + data[i].Value + '">' + data[i].Text + '</option>';
        optionList += option;
    });
    //console.log(optionList);
    $('#empresa').html(optionList);
    $('#empresa').prop('disabled', false);
}


function calculoSubmit(valorGasto, idEstado, idOperadora, email, Operadora, Estado) {
    var fValorGasto = parseFloat(valorGasto);
    $('#calcular').html('Carregando...');
    $.ajax({
        method: 'POST',
       // url: 'http://www.proteste.org.br/restituicao-icms-energia/simular',
        url: '/Api/CorePT/obterCalculoReembolso',
        data: {
            valorGasto: fValorGasto,
            idEstado: idEstado,
            idOperadora: idOperadora,
            Email: email,
            Operadora: Operadora,
            Estado: Estado,
        },
        success: function(data) {
            calculoSuccess(data);
            $('#rValorReembolso').html(data.ResultadoCalculo);
            $('#rValorGasto').html("R$ " + Math.round(fValorGasto));
            $('#rEstado').html(Estado);
           // $('#rOperadora').html(Operadora);

        },
        error: function() {
            alertErro();
        }
    });
}


function calculoSuccess(data) {
    //retorno da api proteste
    if (data.Success) {

        document.querySelector('#calculadora-resultado').scrollIntoView({
            behavior: 'smooth'
        });

        $('#calculadora-novo').fadeOut(600);
        $('#calculadora-resultado').delay(600).fadeIn();
        //reseta
        document.forms[0].reset();
        $('#calcular').html('calcular');
        $('#empresa').prop('disabled', true);
        $('#empresa').html('<option value=""></option>');

        //localStorage.setItem('icms.valorReembolso', data.ResultadoCalculo);
       
        //$('#modal-success').show();

        //$("#cadastro-thank").hide();
        //$("#calculo-thank").show();
        
        window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
        ga('create', 'UA-117756836-1');
        ga('send', 'event', 'cta_form', 'cta1', 'calcule');
    } else {
        alertErro();
    }
}





function cadastroSubmit(nome, email, telefone, horario) {
    $('#btn-submit-form-me-ligue').html('Carregando...');
    $.ajax({
        method: 'POST',
        // url: '/restituicao-icms-energia/cadastrar',
        url: '/Api/CorePT/RetornoInserirUser',
        data: {
            Nome: nome,
            Email: email,
            Celular: telefone,
            Campanha: 'PULLACTION:REEMBOLSO-ICMS',
            Horario: horario,

        },
        success: function () {
            document.forms[1].reset();
            window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
            ga('create', 'UA-117756836-1');
            ga('send', 'event', 'cta_form', 'cta2', 'assine');

            $('#modal-success').show();
    
            $("#cadastro-thank").show();
            $("#calculo-thank").hide();
            $('#btn-submit-form-me-ligue').html('Me ligue');
        },
        error: function() {
            alertErro();
            $('#btn-submit-form-me-ligue').html('Me ligue');
        }
        
    });
    
}



$('#rReaverDinheiro').click(function (e) {
    e.preventDefault();

    $("#form").addClass("closed");
    $('.cta-mobile').removeClass("hide");

    document.querySelector('#reaver-dinheiro').scrollIntoView({
        behavior: 'smooth'
    });

    $('#calculadora-novo').delay(1000).show();
    $('#calculadora-resultado').hide();

    if ($(this).width() > 1024) {
        setTimeout(function () { $('#reaver-dinheiro').animateCss('pulse'); }, 1000);
    }

});















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
            var Email = $('#email').val();
            var Operadora = $("#empresa option[value=" + $("#empresa").val() + "]").html();
            var Estado = $("#estado option[value=" + $("#estado").val() + "]").html();


            //localStorage.setItem('icms.estado', Estado);
            //localStorage.setItem('icms.operadora', Operadora);
            //localStorage.setItem('icms.valorGasto', valorGasto);

            calculoSubmit(valorGasto, idEstado, idOperadora, Email, Operadora, Estado);
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