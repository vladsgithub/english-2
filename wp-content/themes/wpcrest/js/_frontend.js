/**
 * @package WordPress
 * @subpackage WPCrest
 */

var WPCrest = WPCrest || {
	Frontend : {
		load_page_preloader: function() {
			if(wpcrest_frontend.disable_page_preloader != 1) {
				jQuery('.wpc-loading').fadeOut();
			}
		},
		load_ajax_preloader: function() {
			if(wpcrest_frontend.disable_ajax_preloader != 1) {
				jQuery('.wpc-loading').ajaxStart(function() {
					jQuery(this).show();
				});
		
				jQuery('.wpc-loading').ajaxStop(function() {
					jQuery(this).hide();

					jQuery(document).trigger('wpc-refresh');
				});
			}
		},
		load_links_menu: function() {
			jQuery('.wpc-links .wpc-navigation li').each(function() {
				if(jQuery(this).children('ul').length > 0) {
					jQuery('> a', this).append('<span>&raquo;</span>');
				}
			});
		},
		load_scheme_switcher: function() {
			if(wpcrest_frontend.disable_scheme_switcher != 1) {
				jQuery('.wpc-schemes .wpc-list .wpc-font-size img').click(function() {
					var font_base_size = 0.625;
		
					var font_size_relative = parseFloat(jQuery.cookie('wpc-font-size-relative'));
		
					if(isNaN(font_size_relative)) {
						font_size_relative = 0;
					}
		
					var font_action = jQuery(this).attr('class');
		
					if(font_action == 'wpc-decrease') {
						font_size_relative -= 0.1;
					}
					else if(font_action == 'wpc-increase') {
						font_size_relative += 0.1;
					}
					else if(font_action == 'wpc-default') {
						font_size_relative = 0;
					}
		
					font_size = font_base_size + font_size_relative;
		
					font_size = font_size + 'em';
		
					if(font_size == '0.625em') {
						jQuery.removeCookie('wpc-font-size-relative', {path: '/'});
					}
					else {
						jQuery.cookie('wpc-font-size-relative', font_size_relative, {path: '/', expires: 30});
					}
		
					jQuery('html').css('font-size', font_size);

					jQuery(document).trigger('wpc-refresh');
				});
		
				jQuery('.wpc-schemes .wpc-skins li').click(function() {
					var skin_name = jQuery(this).attr('class').split(' ')[0];

					jQuery.cookie('wpc-active-skin', skin_name, {path: '/', expires: 30});

					if(skin_name == 'none') {
						jQuery('#wpc-skin-css').replaceWith('<link rel="stylesheet" id="wpc-skin-css" type="text/css" media="all" />');
					}
					else {
						jQuery('#wpc-skin-css').replaceWith('<link rel="stylesheet" id="wpc-skin-css" href="' + wpcrest_frontend.template_url + '/schemes/skins/' + skin_name + '/screen.css" type="text/css" media="all" />');
					}

					return false;
				});

				var background_types = {background_underlay: {class_name: 'underlay', tag_name: 'html'}, background_overlay: {class_name: 'overlay', tag_name: 'body'}};

				for(var key in background_types) {
					WPCrest.Frontend.load_scheme_switcher_background(background_types[key].class_name, background_types[key].tag_name);
				}

				var scheme_swither = 'closed';
		
				jQuery('.wpc-schemes .wpc-toggle').click(function() {
					if(scheme_swither == 'closed') {
						jQuery('.wpc-schemes').animate({left: 0});
		
						scheme_swither = 'open';
					}
					else {
						jQuery('.wpc-schemes').animate({left: '-' + jQuery('.wpc-schemes').css('width')});
		
						scheme_swither = 'closed';
					}
				});
			}
		},
		load_scheme_switcher_background: function(class_name, tag_name) {
			jQuery('.wpc-schemes .wpc-background-' + class_name + 's li').click(function() {
				var background_name = jQuery(this).attr('class').split(' ')[0];
	
				jQuery.cookie('wpc-active-background-' + class_name, background_name, {path: '/', expires: 30});
	
				var properties = jQuery(this).data('properties');
	
				if(properties === undefined) {
					jQuery('#wpc-background-' + class_name).remove();
	
					jQuery(tag_name).removeAttr('style');
				}
				else {
					jQuery(tag_name).css('background', 'none');
		
					for(var key in properties) {
						if(key == 'background-image') {
							if(background_name == 'custom') {
								jQuery(tag_name).css('background-image', 'url(' + properties[key] + ')');
							}
							else {
								jQuery(tag_name).css('background-image', 'url(' + wpcrest_frontend.template_url + '/schemes/background-' + class_name + 's/' + properties[key] + ')');
							}
						}
						else if(key == 'background-position' || key == 'background-size') {
							var property = null;
	
							if((properties[key].variable !== undefined) && properties[key].variable.x !== undefined && properties[key].variable.x !== null && properties[key].variable.y !== undefined && properties[key].variable.y !== null) {
								property = properties[key].variable.x + ' ' + properties[key].variable.y;
							}
							else if(properties[key].constant !== null) {
								property = properties[key].constant;
							}
	
							if(property !== 'null') {
								jQuery(tag_name).css(key, property);
							}
						}
						else {
							jQuery(tag_name).css(key, properties[key]);
						}
					}
				}
	
				return false;
			});
		},
		load_masonry: function() {
			jQuery('.wpc-blog-main .wpc-items').imagesLoaded(function() {
				jQuery('.wpc-blog-main .wpc-items').masonry();
			});

			jQuery('.wpc-panel > ul').imagesLoaded(function() {
				jQuery('.wpc-panel > ul').masonry();
			});
		},
		load_colorbox_posts: function() {
			if(wpcrest_frontend.disable_colorbox_posts != 1) {
				WPCrest.Frontend.load_colorbox(jQuery('.wpc-type-post-preview .wpc-title a'), WPCrest.Frontend.colorbox_item_options);
			}
		},
		load_colorbox_images: function() {
			if(wpcrest_frontend.disable_colorbox_images != 1) {
				WPCrest.Frontend.load_colorbox(jQuery('a img').parent('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]'), WPCrest.Frontend.colorbox_item_options);
			}
		},
		load_placeholder: function() {
			jQuery('input, textarea').placeholder();
		},
		load_qtip: function() {
			if(wpcrest_frontend.disable_qtip != 1) {
				jQuery(':not([title]) > [title]').qtip({position: {my: 'left top', at: 'right top'}, style: {classes: 'ui-tooltip-dark ui-tooltip-shadow ui-tooltip-rounded'}});
			}
		},
		load_external_urls_new_window: function() {
			if(wpcrest_frontend.external_urls_new_window == 1) {
				jQuery("a[href*='http://']:not([href*='" + location.hostname + "']),[href*='https://']:not([href*='" + location.hostname + "'])").attr('target', '_blank');
			}
		},
		load_media_urls_new_window: function() {
			if(wpcrest_frontend.media_urls_new_window == 1) {
				jQuery("a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.gif'], a[href$='.pdf']").attr('target', '_blank');
			}
		},
		load_ajax_pagination: function() {
			if(wpcrest_frontend.disable_ajax_pagination != 1) {
				jQuery('.wpc-container').on('click', '.wpc-ajax-request a, .wpc-ajax-request a img', function(event) {
					if(jQuery(event.target).is('.wpc-ajax-request a img')) {
						var ajax_href = jQuery(event.target).parent('a').attr('href');
					}
					else {
						var ajax_href = jQuery(event.target).attr('href');
					}

					jQuery.post(ajax_href, {
							'wpc-action': 'ajax-request'
						},
						function(data) {
							jQuery('.wpc-container').replaceWith(data);

							history.pushState(null, null, ajax_href);
						}
					);
	
					return false;
				});
			}
		},
		load_colorbox: function(element, options) {
			jQuery(element).colorbox(options);
		},
		colorbox_item_options: {
			href: function() {
				return jQuery(this).attr('href') + (/\?+/.test(jQuery(this).attr('href')) === true ? '&' : '?') + 'wpc-action=ajax-request';
			},
			width: '94%',
			height: '94%',
			initialWidth: '94%',
			initialHeight: '94%',
			maxWidth: '94%',
			maxHeight: '94%',
			top: '3%',
			left: '3%',
			fixed: true,
		}
	}
}

jQuery(document).on('ready', function() {
	WPCrest.Frontend.load_page_preloader();

	WPCrest.Frontend.load_ajax_preloader();

	WPCrest.Frontend.load_links_menu();

	WPCrest.Frontend.load_scheme_switcher();
});

jQuery(document).on('ready wpc-refresh', function() {
	WPCrest.Frontend.load_ajax_pagination();

	WPCrest.Frontend.load_masonry();

	WPCrest.Frontend.load_colorbox_posts();

	WPCrest.Frontend.load_colorbox_images();

	WPCrest.Frontend.load_placeholder();

	WPCrest.Frontend.load_qtip();

	WPCrest.Frontend.load_external_urls_new_window();

	WPCrest.Frontend.load_media_urls_new_window();
});


/* Responsive Voice */

/*
 ResponsiveVoice JS v1.4.5

 (c) 2015 LearnBrite

 License: http://responsivevoice.org/license
 */
if ("undefined" != typeof responsiveVoice)console.log("ResponsiveVoice already loaded"), console.log(responsiveVoice); else var ResponsiveVoice = function () {
    var a = this;
    a.version = "1.4.5";
    console.log("ResponsiveVoice r" + a.version);
    a.responsivevoices = [{
        name: "UK English Female",
        flag: "gb",
        gender: "f",
        voiceIDs: [3, 5, 1, 6, 7, 171, 201, 8]
    }, {
        name: "UK English Male",
        flag: "gb",
        gender: "m",
        voiceIDs: [0, 4, 2, 75, 202, 159, 6, 7]
    }, {name: "US English Female", flag: "us", gender: "f", voiceIDs: [39, 40, 41, 42, 43, 173, 205, 204, 44]}, {
        name: "Arabic Male",
        flag: "ar", gender: "m", voiceIDs: [96, 95, 97, 196, 98]
    }, {name: "Armenian Male", flag: "hy", gender: "f", voiceIDs: [99]}, {
        name: "Australian Female",
        flag: "au",
        gender: "f",
        voiceIDs: [87, 86, 5, 201, 88]
    }, {
        name: "Brazilian Portuguese Female",
        flag: "br",
        gender: "f",
        voiceIDs: [124, 123, 125, 186, 223, 126]
    }, {
        name: "Chinese Female",
        flag: "cn",
        gender: "f",
        voiceIDs: [58, 59, 60, 155, 191, 231, 61]
    }, {name: "Czech Female", flag: "cz", gender: "f", voiceIDs: [101, 100, 102, 197, 103]}, {
        name: "Danish Female",
        flag: "dk",
        gender: "f",
        voiceIDs: [105, 104, 106, 198, 107]
    },
        {
            name: "Deutsch Female",
            flag: "de",
            gender: "f",
            voiceIDs: [27, 28, 29, 30, 31, 78, 170, 199, 32]
        }, {
            name: "Dutch Female",
            flag: "nl",
            gender: "f",
            voiceIDs: [219, 84, 157, 158, 184, 45]
        }, {name: "Finnish Female", flag: "fi", gender: "f", voiceIDs: [90, 89, 91, 209, 92]}, {
            name: "French Female",
            flag: "fr",
            gender: "f",
            voiceIDs: [21, 22, 23, 77, 178, 210, 26]
        }, {
            name: "Greek Female",
            flag: "gr",
            gender: "f",
            voiceIDs: [62, 63, 80, 200, 64]
        }, {name: "Hatian Creole Female", flag: "ht", gender: "f", voiceIDs: [109]}, {
            name: "Hindi Female", flag: "hi", gender: "f", voiceIDs: [66,
                154, 179, 213, 67]
        }, {
            name: "Hungarian Female",
            flag: "hu",
            gender: "f",
            voiceIDs: [9, 10, 81, 214, 11]
        }, {
            name: "Indonesian Female",
            flag: "id",
            gender: "f",
            voiceIDs: [111, 112, 180, 215, 113]
        }, {
            name: "Italian Female",
            flag: "it",
            gender: "f",
            voiceIDs: [33, 34, 35, 36, 37, 79, 181, 216, 38]
        }, {
            name: "Japanese Female",
            flag: "jp",
            gender: "f",
            voiceIDs: [50, 51, 52, 153, 182, 217, 53]
        }, {
            name: "Korean Female",
            flag: "kr",
            gender: "f",
            voiceIDs: [54, 55, 56, 156, 183, 218, 57]
        }, {name: "Latin Female", flag: "va", gender: "f", voiceIDs: [114]}, {
            name: "Norwegian Female", flag: "no",
            gender: "f", voiceIDs: [72, 73, 221, 74]
        }, {
            name: "Polish Female",
            flag: "pl",
            gender: "f",
            voiceIDs: [120, 119, 121, 185, 222, 122]
        }, {
            name: "Portuguese Female",
            flag: "br",
            gender: "f",
            voiceIDs: [128, 127, 129, 187, 224, 130]
        }, {
            name: "Romanian Male",
            flag: "ro",
            gender: "m",
            voiceIDs: [151, 150, 152, 225, 46]
        }, {
            name: "Russian Female",
            flag: "ru",
            gender: "f",
            voiceIDs: [47, 48, 83, 188, 226, 49]
        }, {name: "Slovak Female", flag: "sk", gender: "f", voiceIDs: [133, 132, 134, 227, 135]}, {
            name: "Spanish Female", flag: "es", gender: "f", voiceIDs: [19, 16, 17, 18, 20, 76, 174, 207,
                15]
        }, {
            name: "Spanish Latin American Female",
            flag: "es",
            gender: "f",
            voiceIDs: [137, 136, 138, 175, 208, 139]
        }, {name: "Swedish Female", flag: "sv", gender: "f", voiceIDs: [85, 148, 149, 228, 65]}, {
            name: "Tamil Male",
            flag: "hi",
            gender: "m",
            voiceIDs: [141]
        }, {
            name: "Thai Female",
            flag: "th",
            gender: "f",
            voiceIDs: [143, 142, 144, 189, 229, 145]
        }, {
            name: "Turkish Female",
            flag: "tr",
            gender: "f",
            voiceIDs: [69, 70, 82, 190, 230, 71]
        }, {name: "Afrikaans Male", flag: "af", gender: "m", voiceIDs: [93]}, {
            name: "Albanian Male",
            flag: "sq",
            gender: "m",
            voiceIDs: [94]
        }, {
            name: "Bosnian Male",
            flag: "bs", gender: "m", voiceIDs: [14]
        }, {name: "Catalan Male", flag: "catalonia", gender: "m", voiceIDs: [68]}, {
            name: "Croatian Male",
            flag: "hr",
            gender: "m",
            voiceIDs: [13]
        }, {name: "Czech Male", flag: "cz", gender: "m", voiceIDs: [161]}, {
            name: "Danish Male",
            flag: "da",
            gender: "m",
            voiceIDs: [162]
        }, {name: "Esperanto Male", flag: "eo", gender: "m", voiceIDs: [108]}, {
            name: "Finnish Male",
            flag: "fi",
            gender: "m",
            voiceIDs: [160]
        }, {name: "Greek Male", flag: "gr", gender: "m", voiceIDs: [163]}, {
            name: "Hungarian Male",
            flag: "hu",
            gender: "m",
            voiceIDs: [164]
        },
        {name: "Icelandic Male", flag: "is", gender: "m", voiceIDs: [110]}, {
            name: "Latin Male",
            flag: "va",
            gender: "m",
            voiceIDs: [165]
        }, {name: "Latvian Male", flag: "lv", gender: "m", voiceIDs: [115]}, {
            name: "Macedonian Male",
            flag: "mk",
            gender: "m",
            voiceIDs: [116]
        }, {name: "Moldavian Male", flag: "md", gender: "m", voiceIDs: [117]}, {
            name: "Montenegrin Male",
            flag: "me",
            gender: "m",
            voiceIDs: [118]
        }, {name: "Norwegian Male", flag: "no", gender: "m", voiceIDs: [166]}, {
            name: "Serbian Male",
            flag: "sr",
            gender: "m",
            voiceIDs: [12]
        }, {
            name: "Serbo-Croatian Male",
            flag: "hr", gender: "m", voiceIDs: [131]
        }, {name: "Slovak Male", flag: "sk", gender: "m", voiceIDs: [167]}, {
            name: "Swahili Male",
            flag: "sw",
            gender: "m",
            voiceIDs: [140]
        }, {name: "Swedish Male", flag: "sv", gender: "m", voiceIDs: [168]}, {
            name: "Vietnamese Male",
            flag: "vi",
            gender: "m",
            voiceIDs: [146]
        }, {name: "Welsh Male", flag: "cy", gender: "m", voiceIDs: [147]}, {
            name: "US English Male",
            flag: "us",
            gender: "m",
            voiceIDs: [0, 4, 2, 6, 7, 75, 159]
        }, {name: "Fallback UK Female", flag: "gb", gender: "f", voiceIDs: [8]}];
    a.voicecollection = [{name: "Google UK English Male"},
        {name: "Agnes"}, {name: "Daniel Compact"}, {name: "Google UK English Female"}, {
            name: "en-GB",
            rate: .25,
            pitch: 1
        }, {
            name: "en-AU",
            rate: .25,
            pitch: 1
        }, {name: "ingl\u00e9s Reino Unido"}, {name: "English United Kingdom"}, {
            name: "Fallback en-GB Female",
            lang: "en-GB",
            fallbackvoice: !0
        }, {name: "Eszter Compact"}, {name: "hu-HU", rate: .4}, {
            name: "Fallback Hungarian",
            lang: "hu",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Fallback Serbian", lang: "sr", fallbackvoice: !0}, {
            name: "Fallback Croatian",
            lang: "hr",
            fallbackvoice: !0
        }, {
            name: "Fallback Bosnian",
            lang: "bs", fallbackvoice: !0
        }, {
            name: "Fallback Spanish",
            lang: "es",
            fallbackvoice: !0
        }, {name: "Spanish Spain"}, {name: "espa\u00f1ol Espa\u00f1a"}, {
            name: "Diego Compact",
            rate: .3
        }, {name: "Google Espa\u00f1ol"}, {
            name: "es-ES",
            rate: .2
        }, {name: "Google Fran\u00e7ais"}, {name: "French France"}, {name: "franc\u00e9s Francia"}, {
            name: "Virginie Compact",
            rate: .5
        }, {name: "fr-FR", rate: .25}, {
            name: "Fallback French",
            lang: "fr",
            fallbackvoice: !0
        }, {name: "Google Deutsch"}, {name: "German Germany"}, {name: "alem\u00e1n Alemania"}, {
            name: "Yannick Compact",
            rate: .5
        }, {name: "de-DE", rate: .25}, {
            name: "Fallback Deutsch",
            lang: "de",
            fallbackvoice: !0
        }, {name: "Google Italiano"}, {name: "Italian Italy"}, {name: "italiano Italia"}, {
            name: "Paolo Compact",
            rate: .5
        }, {name: "it-IT", rate: .25}, {
            name: "Fallback Italian",
            lang: "it",
            fallbackvoice: !0
        }, {
            name: "Google US English",
            timerSpeed: 1
        }, {name: "English United States"}, {name: "ingl\u00e9s Estados Unidos"}, {name: "Vicki"}, {
            name: "en-US",
            rate: .2,
            pitch: 1,
            timerSpeed: 1.3
        }, {name: "Fallback English", lang: "en-US", fallbackvoice: !0, timerSpeed: 0},
        {name: "Fallback Dutch", lang: "nl", fallbackvoice: !0, timerSpeed: 0}, {
            name: "Fallback Romanian",
            lang: "ro",
            fallbackvoice: !0
        }, {name: "Milena Compact"}, {name: "ru-RU", rate: .25}, {
            name: "Fallback Russian",
            lang: "ru",
            fallbackvoice: !0
        }, {name: "Google \u65e5\u672c\u4eba", timerSpeed: 1}, {name: "Kyoko Compact"}, {
            name: "ja-JP",
            rate: .25
        }, {name: "Fallback Japanese", lang: "ja", fallbackvoice: !0}, {
            name: "Google \ud55c\uad6d\uc758",
            timerSpeed: 1
        }, {name: "Narae Compact"}, {name: "ko-KR", rate: .25}, {
            name: "Fallback Korean",
            lang: "ko",
            fallbackvoice: !0
        },
        {name: "Google \u4e2d\u56fd\u7684", timerSpeed: 1}, {name: "Ting-Ting Compact"}, {
            name: "zh-CN",
            rate: .25
        }, {name: "Fallback Chinese", lang: "zh-CN", fallbackvoice: !0}, {name: "Alexandros Compact"}, {
            name: "el-GR",
            rate: .25
        }, {name: "Fallback Greek", lang: "el", fallbackvoice: !0, service: "g2"}, {
            name: "Fallback Swedish",
            lang: "sv",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "hi-IN", rate: .25}, {
            name: "Fallback Hindi",
            lang: "hi",
            fallbackvoice: !0
        }, {name: "Fallback Catalan", lang: "ca", fallbackvoice: !0}, {name: "Aylin Compact"}, {
            name: "tr-TR",
            rate: .25
        }, {name: "Fallback Turkish", lang: "tr", fallbackvoice: !0}, {name: "Stine Compact"}, {
            name: "no-NO",
            rate: .25
        }, {
            name: "Fallback Norwegian",
            lang: "no",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Daniel"}, {name: "Monica"}, {name: "Amelie"}, {name: "Anna"}, {name: "Alice"}, {name: "Melina"}, {name: "Mariska"}, {name: "Yelda"}, {name: "Milena"}, {name: "Xander"}, {name: "Alva"}, {name: "Lee Compact"}, {name: "Karen"}, {
            name: "Fallback Australian",
            lang: "en-AU",
            fallbackvoice: !0
        }, {name: "Mikko Compact"}, {name: "Satu"}, {name: "fi-FI", rate: .25},
        {name: "Fallback Finnish", lang: "fi", fallbackvoice: !0, service: "g2"}, {
            name: "Fallback Afrikans",
            lang: "af",
            fallbackvoice: !0
        }, {
            name: "Fallback Albanian",
            lang: "sq",
            fallbackvoice: !0
        }, {name: "Maged Compact"}, {name: "Tarik"}, {name: "ar-SA", rate: .25}, {
            name: "Fallback Arabic",
            lang: "ar",
            fallbackvoice: !0,
            service: "g2"
        }, {
            name: "Fallback Armenian",
            lang: "hy",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Zuzana Compact"}, {name: "Zuzana"}, {name: "cs-CZ", rate: .25}, {
            name: "Fallback Czech",
            lang: "cs",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Ida Compact"},
        {name: "Sara"}, {name: "da-DK", rate: .25}, {
            name: "Fallback Danish",
            lang: "da",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Fallback Esperanto", lang: "eo", fallbackvoice: !0}, {
            name: "Fallback Hatian Creole",
            lang: "ht",
            fallbackvoice: !0
        }, {name: "Fallback Icelandic", lang: "is", fallbackvoice: !0}, {name: "Damayanti"}, {
            name: "id-ID",
            rate: .25
        }, {name: "Fallback Indonesian", lang: "id", fallbackvoice: !0}, {
            name: "Fallback Latin",
            lang: "la",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Fallback Latvian", lang: "lv", fallbackvoice: !0}, {
            name: "Fallback Macedonian",
            lang: "mk", fallbackvoice: !0
        }, {name: "Fallback Moldavian", lang: "mo", fallbackvoice: !0, service: "g2"}, {
            name: "Fallback Montenegrin",
            lang: "sr-ME",
            fallbackvoice: !0
        }, {name: "Agata Compact"}, {name: "Zosia"}, {name: "pl-PL", rate: .25}, {
            name: "Fallback Polish",
            lang: "pl",
            fallbackvoice: !0
        }, {name: "Raquel Compact"}, {name: "Luciana"}, {
            name: "pt-BR",
            rate: .25
        }, {
            name: "Fallback Brazilian Portugese",
            lang: "pt-BR",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Joana Compact"}, {name: "Joana"}, {name: "pt-PT", rate: .25}, {
            name: "Fallback Portuguese",
            lang: "pt-PT", fallbackvoice: !0
        }, {
            name: "Fallback Serbo-Croation",
            lang: "sh",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Laura Compact"}, {name: "Laura"}, {name: "sk-SK", rate: .25}, {
            name: "Fallback Slovak",
            lang: "sk",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Javier Compact"}, {name: "Paulina"}, {
            name: "es-MX",
            rate: .25
        }, {
            name: "Fallback Spanish (Latin American)",
            lang: "es-419",
            fallbackvoice: !0,
            service: "g2"
        }, {name: "Fallback Swahili", lang: "sw", fallbackvoice: !0}, {
            name: "Fallback Tamil",
            lang: "ta",
            fallbackvoice: !0
        }, {name: "Narisa Compact"},
        {name: "Kanya"}, {name: "th-TH", rate: .25}, {
            name: "Fallback Thai",
            lang: "th",
            fallbackvoice: !0
        }, {name: "Fallback Vietnamese", lang: "vi", fallbackvoice: !0}, {
            name: "Fallback Welsh",
            lang: "cy",
            fallbackvoice: !0
        }, {name: "Oskar Compact"}, {
            name: "sv-SE",
            rate: .25
        }, {name: "Simona Compact"}, {name: "Ioana"}, {
            name: "ro-RO",
            rate: .25
        }, {name: "Kyoko"}, {name: "Lekha"}, {name: "Ting-Ting"}, {name: "Yuna"}, {name: "Xander Compact"}, {
            name: "nl-NL",
            rate: .25
        }, {name: "Fallback UK English Male", lang: "en-GB", fallbackvoice: !0, service: "g1", voicename: "rjs"},
        {name: "Finnish Male", lang: "fi", fallbackvoice: !0, service: "g1", voicename: ""}, {
            name: "Czech Male",
            lang: "cs",
            fallbackvoice: !0,
            service: "g1",
            voicename: ""
        }, {name: "Danish Male", lang: "da", fallbackvoice: !0, service: "g1", voicename: ""}, {
            name: "Greek Male",
            lang: "el",
            fallbackvoice: !0,
            service: "g1",
            voicename: "",
            rate: .25
        }, {name: "Hungarian Male", lang: "hu", fallbackvoice: !0, service: "g1", voicename: ""}, {
            name: "Latin Male",
            lang: "la",
            fallbackvoice: !0,
            service: "g1",
            voicename: ""
        }, {
            name: "Norwegian Male", lang: "no", fallbackvoice: !0,
            service: "g1", voicename: ""
        }, {name: "Slovak Male", lang: "sk", fallbackvoice: !0, service: "g1", voicename: ""}, {
            name: "Swedish Male",
            lang: "sv",
            fallbackvoice: !0,
            service: "g1",
            voicename: ""
        }, {
            name: "Fallback US English Male",
            lang: "en",
            fallbackvoice: !0,
            service: "tts-api",
            voicename: ""
        }, {name: "German Germany", lang: "de_DE"}, {
            name: "English United Kingdom",
            lang: "en_GB"
        }, {name: "English India", lang: "en_IN"}, {
            name: "English United States",
            lang: "en_US"
        }, {name: "Spanish Spain", lang: "es_ES"}, {name: "Spanish Mexico", lang: "es_MX"},
        {name: "Spanish United States", lang: "es_US"}, {name: "French Belgium", lang: "fr_BE"}, {
            name: "French France",
            lang: "fr_FR"
        }, {name: "Hindi India", lang: "hi_IN"}, {name: "Indonesian Indonesia", lang: "in_ID"}, {
            name: "Italian Italy",
            lang: "it_IT"
        }, {name: "Japanese Japan", lang: "ja_JP"}, {
            name: "Korean South Korea",
            lang: "ko_KR"
        }, {name: "Dutch Netherlands", lang: "nl_NL"}, {
            name: "Polish Poland",
            lang: "pl_PL"
        }, {name: "Portuguese Brazil", lang: "pt_BR"}, {
            name: "Portuguese Portugal",
            lang: "pt_PT"
        }, {name: "Russian Russia", lang: "ru_RU"},
        {name: "Thai Thailand", lang: "th_TH"}, {name: "Turkish Turkey", lang: "tr_TR"}, {
            name: "Chinese China",
            lang: "zh_CN_#Hans"
        }, {name: "Chinese Hong Kong", lang: "zh_HK_#Hans"}, {
            name: "Chinese Hong Kong",
            lang: "zh_HK_#Hant"
        }, {name: "Chinese Taiwan", lang: "zh_TW_#Hant"}, {name: "Alex"}, {
            name: "Maged",
            lang: "ar-SA"
        }, {name: "Zuzana", lang: "cs-CZ"}, {name: "Sara", lang: "da-DK"}, {
            name: "Anna",
            lang: "de-DE"
        }, {name: "Melina", lang: "el-GR"}, {name: "Karen", lang: "en-AU"}, {
            name: "Daniel",
            lang: "en-GB"
        }, {name: "Moira", lang: "en-IE"}, {
            name: "Samantha (Enhanced)",
            lang: "en-US"
        }, {name: "Samantha", lang: "en-US"}, {name: "Tessa", lang: "en-ZA"}, {
            name: "Monica",
            lang: "es-ES"
        }, {name: "Paulina", lang: "es-MX"}, {name: "Satu", lang: "fi-FI"}, {
            name: "Amelie",
            lang: "fr-CA"
        }, {name: "Thomas", lang: "fr-FR"}, {name: "Carmit", lang: "he-IL"}, {
            name: "Lekha",
            lang: "hi-IN"
        }, {name: "Mariska", lang: "hu-HU"}, {name: "Damayanti", lang: "id-ID"}, {
            name: "Alice",
            lang: "it-IT"
        }, {name: "Kyoko", lang: "ja-JP"}, {name: "Yuna", lang: "ko-KR"}, {
            name: "Ellen",
            lang: "nl-BE"
        }, {name: "Xander", lang: "nl-NL"}, {name: "Nora", lang: "no-NO"},
        {name: "Zosia", lang: "pl-PL"}, {name: "Luciana", lang: "pt-BR"}, {
            name: "Joana",
            lang: "pt-PT"
        }, {name: "Ioana", lang: "ro-RO"}, {name: "Milena", lang: "ru-RU"}, {
            name: "Laura",
            lang: "sk-SK"
        }, {name: "Alva", lang: "sv-SE"}, {name: "Kanya", lang: "th-TH"}, {
            name: "Yelda",
            lang: "tr-TR"
        }, {name: "Ting-Ting", lang: "zh-CN"}, {name: "Sin-Ji", lang: "zh-HK"}, {name: "Mei-Jia", lang: "zh-TW"}];
    a.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    a.iOS9 = /(iphone|ipod|ipad).* os 9_/.test(navigator.userAgent.toLowerCase());
    a.is_chrome = -1 < navigator.userAgent.indexOf("Chrome");
    a.is_safari = -1 < navigator.userAgent.indexOf("Safari");
    a.is_chrome && a.is_safari && (a.is_safari = !1);
    a.is_opera = !!window.opera || 0 <= navigator.userAgent.indexOf(" OPR/");
    a.iOS_initialized = !1;
    a.cache_ios_voices = [{name: "he-IL", voiceURI: "he-IL", lang: "he-IL"}, {
        name: "th-TH",
        voiceURI: "th-TH",
        lang: "th-TH"
    }, {name: "pt-BR", voiceURI: "pt-BR", lang: "pt-BR"}, {
        name: "sk-SK",
        voiceURI: "sk-SK",
        lang: "sk-SK"
    }, {name: "fr-CA", voiceURI: "fr-CA", lang: "fr-CA"}, {name: "ro-RO", voiceURI: "ro-RO", lang: "ro-RO"}, {
        name: "no-NO", voiceURI: "no-NO",
        lang: "no-NO"
    }, {name: "fi-FI", voiceURI: "fi-FI", lang: "fi-FI"}, {
        name: "pl-PL",
        voiceURI: "pl-PL",
        lang: "pl-PL"
    }, {name: "de-DE", voiceURI: "de-DE", lang: "de-DE"}, {
        name: "nl-NL",
        voiceURI: "nl-NL",
        lang: "nl-NL"
    }, {name: "id-ID", voiceURI: "id-ID", lang: "id-ID"}, {
        name: "tr-TR",
        voiceURI: "tr-TR",
        lang: "tr-TR"
    }, {name: "it-IT", voiceURI: "it-IT", lang: "it-IT"}, {
        name: "pt-PT",
        voiceURI: "pt-PT",
        lang: "pt-PT"
    }, {name: "fr-FR", voiceURI: "fr-FR", lang: "fr-FR"}, {
        name: "ru-RU",
        voiceURI: "ru-RU",
        lang: "ru-RU"
    }, {name: "es-MX", voiceURI: "es-MX", lang: "es-MX"},
        {name: "zh-HK", voiceURI: "zh-HK", lang: "zh-HK"}, {
            name: "sv-SE",
            voiceURI: "sv-SE",
            lang: "sv-SE"
        }, {name: "hu-HU", voiceURI: "hu-HU", lang: "hu-HU"}, {
            name: "zh-TW",
            voiceURI: "zh-TW",
            lang: "zh-TW"
        }, {name: "es-ES", voiceURI: "es-ES", lang: "es-ES"}, {
            name: "zh-CN",
            voiceURI: "zh-CN",
            lang: "zh-CN"
        }, {name: "nl-BE", voiceURI: "nl-BE", lang: "nl-BE"}, {
            name: "en-GB",
            voiceURI: "en-GB",
            lang: "en-GB"
        }, {name: "ar-SA", voiceURI: "ar-SA", lang: "ar-SA"}, {
            name: "ko-KR",
            voiceURI: "ko-KR",
            lang: "ko-KR"
        }, {name: "cs-CZ", voiceURI: "cs-CZ", lang: "cs-CZ"}, {
            name: "en-ZA",
            voiceURI: "en-ZA", lang: "en-ZA"
        }, {name: "en-AU", voiceURI: "en-AU", lang: "en-AU"}, {
            name: "da-DK",
            voiceURI: "da-DK",
            lang: "da-DK"
        }, {name: "en-US", voiceURI: "en-US", lang: "en-US"}, {
            name: "en-IE",
            voiceURI: "en-IE",
            lang: "en-IE"
        }, {name: "hi-IN", voiceURI: "hi-IN", lang: "hi-IN"}, {
            name: "el-GR",
            voiceURI: "el-GR",
            lang: "el-GR"
        }, {name: "ja-JP", voiceURI: "ja-JP", lang: "ja-JP"}];
    a.cache_ios9_voices = [{
        name: "Maged",
        voiceURI: "com.apple.ttsbundle.Maged-compact",
        lang: "ar-SA",
        localService: !0,
        "default": !0
    }, {
        name: "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact",
        lang: "cs-CZ", localService: !0, "default": !0
    }, {
        name: "Sara",
        voiceURI: "com.apple.ttsbundle.Sara-compact",
        lang: "da-DK",
        localService: !0,
        "default": !0
    }, {
        name: "Anna",
        voiceURI: "com.apple.ttsbundle.Anna-compact",
        lang: "de-DE",
        localService: !0,
        "default": !0
    }, {
        name: "Melina",
        voiceURI: "com.apple.ttsbundle.Melina-compact",
        lang: "el-GR",
        localService: !0,
        "default": !0
    }, {name: "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", lang: "en-AU", localService: !0, "default": !0}, {
        name: "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact",
        lang: "en-GB", localService: !0, "default": !0
    }, {
        name: "Moira",
        voiceURI: "com.apple.ttsbundle.Moira-compact",
        lang: "en-IE",
        localService: !0,
        "default": !0
    }, {
        name: "Samantha (Enhanced)",
        voiceURI: "com.apple.ttsbundle.Samantha-premium",
        lang: "en-US",
        localService: !0,
        "default": !0
    }, {
        name: "Samantha",
        voiceURI: "com.apple.ttsbundle.Samantha-compact",
        lang: "en-US",
        localService: !0,
        "default": !0
    }, {name: "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", lang: "en-ZA", localService: !0, "default": !0}, {
        name: "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact",
        lang: "es-ES", localService: !0, "default": !0
    }, {
        name: "Paulina",
        voiceURI: "com.apple.ttsbundle.Paulina-compact",
        lang: "es-MX",
        localService: !0,
        "default": !0
    }, {
        name: "Satu",
        voiceURI: "com.apple.ttsbundle.Satu-compact",
        lang: "fi-FI",
        localService: !0,
        "default": !0
    }, {
        name: "Amelie",
        voiceURI: "com.apple.ttsbundle.Amelie-compact",
        lang: "fr-CA",
        localService: !0,
        "default": !0
    }, {
        name: "Thomas",
        voiceURI: "com.apple.ttsbundle.Thomas-compact",
        lang: "fr-FR",
        localService: !0,
        "default": !0
    }, {
        name: "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact",
        lang: "he-IL", localService: !0, "default": !0
    }, {
        name: "Lekha",
        voiceURI: "com.apple.ttsbundle.Lekha-compact",
        lang: "hi-IN",
        localService: !0,
        "default": !0
    }, {
        name: "Mariska",
        voiceURI: "com.apple.ttsbundle.Mariska-compact",
        lang: "hu-HU",
        localService: !0,
        "default": !0
    }, {
        name: "Damayanti",
        voiceURI: "com.apple.ttsbundle.Damayanti-compact",
        lang: "id-ID",
        localService: !0,
        "default": !0
    }, {name: "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", lang: "it-IT", localService: !0, "default": !0}, {
        name: "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact",
        lang: "ja-JP", localService: !0, "default": !0
    }, {
        name: "Yuna",
        voiceURI: "com.apple.ttsbundle.Yuna-compact",
        lang: "ko-KR",
        localService: !0,
        "default": !0
    }, {
        name: "Ellen",
        voiceURI: "com.apple.ttsbundle.Ellen-compact",
        lang: "nl-BE",
        localService: !0,
        "default": !0
    }, {
        name: "Xander",
        voiceURI: "com.apple.ttsbundle.Xander-compact",
        lang: "nl-NL",
        localService: !0,
        "default": !0
    }, {name: "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", lang: "no-NO", localService: !0, "default": !0}, {
        name: "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact",
        lang: "pl-PL", localService: !0, "default": !0
    }, {
        name: "Luciana",
        voiceURI: "com.apple.ttsbundle.Luciana-compact",
        lang: "pt-BR",
        localService: !0,
        "default": !0
    }, {
        name: "Joana",
        voiceURI: "com.apple.ttsbundle.Joana-compact",
        lang: "pt-PT",
        localService: !0,
        "default": !0
    }, {
        name: "Ioana",
        voiceURI: "com.apple.ttsbundle.Ioana-compact",
        lang: "ro-RO",
        localService: !0,
        "default": !0
    }, {
        name: "Milena",
        voiceURI: "com.apple.ttsbundle.Milena-compact",
        lang: "ru-RU",
        localService: !0,
        "default": !0
    }, {
        name: "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact",
        lang: "sk-SK", localService: !0, "default": !0
    }, {
        name: "Alva",
        voiceURI: "com.apple.ttsbundle.Alva-compact",
        lang: "sv-SE",
        localService: !0,
        "default": !0
    }, {
        name: "Kanya",
        voiceURI: "com.apple.ttsbundle.Kanya-compact",
        lang: "th-TH",
        localService: !0,
        "default": !0
    }, {
        name: "Yelda",
        voiceURI: "com.apple.ttsbundle.Yelda-compact",
        lang: "tr-TR",
        localService: !0,
        "default": !0
    }, {
        name: "Ting-Ting",
        voiceURI: "com.apple.ttsbundle.Ting-Ting-compact",
        lang: "zh-CN",
        localService: !0,
        "default": !0
    }, {
        name: "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact",
        lang: "zh-HK", localService: !0, "default": !0
    }, {
        name: "Mei-Jia",
        voiceURI: "com.apple.ttsbundle.Mei-Jia-compact",
        lang: "zh-TW",
        localService: !0,
        "default": !0
    }];
    a.systemvoices = null;
    a.CHARACTER_LIMIT = 100;
    a.VOICESUPPORT_ATTEMPTLIMIT = 5;
    a.voicesupport_attempts = 0;
    a.fallbackMode = !1;
    a.WORDS_PER_MINUTE = 130;
    a.fallback_parts = null;
    a.fallback_part_index = 0;
    a.fallback_audio = null;
    a.fallback_playbackrate = 1;
    a.def_fallback_playbackrate = a.fallback_playbackrate;
    a.fallback_audiopool = [];
    a.msgparameters = null;
    a.timeoutId = null;
    a.OnLoad_callbacks =
        [];
    a.useTimer = !1;
    a.utterances = [];
    a.tstCompiled = function (a) {
        return eval("typeof xy === 'undefined'")
    };
    a.fallbackServicePath = "https://code.responsivevoice.org/" + (a.tstCompiled() ? "" : "develop/") + "getvoice.php";
    a.default_rv = a.responsivevoices[0];
    a.init = function () {
        a.is_opera || "undefined" === typeof speechSynthesis ? (console.log("RV: Voice synthesis not supported"), a.enableFallbackMode()) : setTimeout(function () {
            var b = setInterval(function () {
                var c = window.speechSynthesis.getVoices();
                0 != c.length || null != a.systemvoices &&
                0 != a.systemvoices.length ? (console.log("RV: Voice support ready"), a.systemVoicesReady(c), clearInterval(b)) : (console.log("Voice support NOT ready"), a.voicesupport_attempts++, a.voicesupport_attempts > a.VOICESUPPORT_ATTEMPTLIMIT && (clearInterval(b), null != window.speechSynthesis ? a.iOS ? (a.iOS9 ? a.systemVoicesReady(a.cache_ios9_voices) : a.systemVoicesReady(a.cache_ios_voices), console.log("RV: Voice support ready (cached)")) : (console.log("RV: speechSynthesis present but no system voices found"), a.enableFallbackMode()) :
                    a.enableFallbackMode()))
            }, 100)
        }, 100);
        a.Dispatch("OnLoad")
    };
    a.systemVoicesReady = function (b) {
        a.systemvoices = b;
        a.mapRVs();
        null != a.OnVoiceReady && a.OnVoiceReady.call();
        a.Dispatch("OnReady");
        window.hasOwnProperty("dispatchEvent") && window.dispatchEvent(new Event("ResponsiveVoice_OnReady"))
    };
    a.enableFallbackMode = function () {
        a.fallbackMode = !0;
        console.log("RV: Enabling fallback mode");
        a.mapRVs();
        null != a.OnVoiceReady && a.OnVoiceReady.call();
        a.Dispatch("OnReady");
        window.hasOwnProperty("dispatchEvent") && window.dispatchEvent(new Event("ResponsiveVoice_OnReady"))
    };
    a.getVoices = function () {
        for (var b = [], c = 0; c < a.responsivevoices.length; c++)b.push({name: a.responsivevoices[c].name});
        return b
    };
    a.speak = function (b, c, e) {
        a.isPlaying() && (console.log("Cancelling previous speech"), a.cancel());
        a.fallbackMode && 0 < a.fallback_audiopool.length && a.clearFallbackPool();
        b = b.replace(/[\"\`]/gm, "'");
        a.msgparameters = e || {};
        a.msgtext = b;
        a.msgvoicename = c;
        a.onstartFired = !1;
        var f = [];
        if (b.length > a.CHARACTER_LIMIT) {
            for (var d = b; d.length > a.CHARACTER_LIMIT;) {
                b = d.search(/[:!?.;]+/);
                var g = "";
                if (-1 ==
                    b || b >= a.CHARACTER_LIMIT)b = d.search(/[,]+/);
                -1 == b && -1 == d.search(" ") && (b = 99);
                if (-1 == b || b >= a.CHARACTER_LIMIT) {
                    var h = d.split(" ");
                    for (b = 0; b < h.length && !(g.length + h[b].length + 1 > a.CHARACTER_LIMIT); b++)g += (0 != b ? " " : "") + h[b]
                } else g = d.substr(0, b + 1);
                d = d.substr(g.length, d.length - g.length);
                f.push(g)
            }
            0 < d.length && f.push(d)
        } else f.push(b);
        a.multipartText = f;
        b = null == c ? a.default_rv : a.getResponsiveVoice(c);
        d = {};
        if (null != b.mappedProfile)d = b.mappedProfile; else if (d.systemvoice = a.getMatchedVoice(b), d.collectionvoice = {},
            null == d.systemvoice) {
            console.log("RV: ERROR: No voice found for: " + c);
            return
        }
        1 == d.collectionvoice.fallbackvoice ? (a.fallbackMode = !0, a.fallback_parts = []) : a.fallbackMode = !1;
        a.msgprofile = d;
        a.utterances = [];
        for (b = 0; b < f.length; b++)a.fallbackMode ? (a.fallback_playbackrate = a.def_fallback_playbackrate, c = a.selectBest([d.collectionvoice.pitch, d.systemvoice.pitch, 1]), g = a.selectBest([a.iOS9 ? 1 : null, d.collectionvoice.rate, d.systemvoice.rate, 1]), h = a.selectBest([d.collectionvoice.volume, d.systemvoice.volume, 1]), null !=
        e && (c *= null != e.pitch ? e.pitch : 1, g *= null != e.rate ? e.rate : 1, h *= null != e.volume ? e.volume : 1), c /= 2, g /= 2, h *= 2, c = Math.min(Math.max(c, 0), 1), g = Math.min(Math.max(g, 0), 1), h = Math.min(Math.max(h, 0), 1), c = a.fallbackServicePath + "?t=" + encodeURIComponent(f[b]) + "&tl=" + (d.collectionvoice.lang || d.systemvoice.lang || "en-US") + "&sv=" + (d.collectionvoice.service || d.systemvoice.service || "") + "&vn=" + (d.collectionvoice.voicename || d.systemvoice.voicename || "") + "&pitch=" + c.toString() + "&rate=" + g.toString() + "&vol=" + h.toString(), g = document.createElement("AUDIO"),
            g.src = c, g.playbackRate = a.fallback_playbackrate, g.preload = "auto", g.load(), a.fallback_parts.push(g)) : (c = new SpeechSynthesisUtterance, c.voice = d.systemvoice, c.voiceURI = d.systemvoice.voiceURI, c.volume = a.selectBest([d.collectionvoice.volume, d.systemvoice.volume, 1]), c.rate = a.selectBest([a.iOS9 ? 1 : null, d.collectionvoice.rate, d.systemvoice.rate, 1]), c.pitch = a.selectBest([d.collectionvoice.pitch, d.systemvoice.pitch, 1]), c.text = f[b], c.lang = a.selectBest([d.collectionvoice.lang, d.systemvoice.lang]), c.rvIndex = b, c.rvTotal =
            f.length, 0 == b && (c.onstart = a.speech_onstart), a.msgparameters.onendcalled = !1, null != e ? (b < f.length - 1 && 1 < f.length ? (c.onend = a.onPartEnd, c.hasOwnProperty("addEventListener") && c.addEventListener("end", a.onPartEnd)) : (c.onend = a.speech_onend, c.hasOwnProperty("addEventListener") && c.addEventListener("end", a.speech_onend)), c.onerror = e.onerror || function (a) {
            console.log("RV: Unknow Error");
            console.log(a)
        }, c.onpause = e.onpause, c.onresume = e.onresume, c.onmark = e.onmark, c.onboundary = e.onboundary || a.onboundary, c.pitch = null !=
        e.pitch ? e.pitch : c.pitch, c.rate = a.iOS ? (null != e.rate ? e.rate * e.rate : 1) * c.rate : (null != e.rate ? e.rate : 1) * c.rate, c.volume = null != e.volume ? e.volume : c.volume) : (c.onend = a.speech_onend, c.onerror = function (a) {
            console.log("RV: Unknow Error");
            console.log(a)
        }), a.utterances.push(c), 0 == b && (a.currentMsg = c), console.log(c), a.tts_speak(c));
        a.fallbackMode && (a.fallback_part_index = 0, a.fallback_startPart())
    };
    a.startTimeout = function (b, c) {
        var e = a.msgprofile.collectionvoice.timerSpeed;
        null == a.msgprofile.collectionvoice.timerSpeed &&
        (e = 1);
        if (!(0 >= e)) {
            var f = b.split(/\s+/).length, d = (b.match(/[^ ]/igm) || b).length / f / 5.1, e = 60 / a.WORDS_PER_MINUTE * e * 1E3 * d * f;
            3 > f && (e = 4E3);
            3E3 > e && (e = 3E3);
            a.timeoutId = setTimeout(c, e)
        }
    };
    a.checkAndCancelTimeout = function () {
        null != a.timeoutId && (clearTimeout(a.timeoutId), a.timeoutId = null)
    };
    a.speech_timedout = function () {
        a.cancel();
        a.cancelled = !1;
        a.speech_onend()
    };
    a.speech_onend = function () {
        a.checkAndCancelTimeout();
        !0 === a.cancelled ? a.cancelled = !1 : null != a.msgparameters && null != a.msgparameters.onend && 1 != a.msgparameters.onendcalled &&
        (a.msgparameters.onendcalled = !0, a.msgparameters.onend())
    };
    a.speech_onstart = function () {
        if (!a.onstartFired) {
            a.onstartFired = !0;
            if (a.iOS || a.is_safari || a.useTimer)a.fallbackMode || a.startTimeout(a.msgtext, a.speech_timedout);
            a.msgparameters.onendcalled = !1;
            if (null != a.msgparameters && null != a.msgparameters.onstart)a.msgparameters.onstart()
        }
    };
    a.fallback_startPart = function () {
        0 == a.fallback_part_index && a.speech_onstart();
        a.fallback_audio = a.fallback_parts[a.fallback_part_index];
        if (null == a.fallback_audio)console.log("RV: Fallback Audio is not available");
        else {
            var b = a.fallback_audio;
            a.fallback_audiopool.push(b);
            setTimeout(function () {
                b.playbackRate = a.fallback_playbackrate
            }, 50);
            b.onloadedmetadata = function () {
                b.play();
                b.playbackRate = a.fallback_playbackrate
            };
            a.fallback_audio.play();
            a.fallback_audio.addEventListener("ended", a.fallback_finishPart);
            a.useTimer && a.startTimeout(a.multipartText[a.fallback_part_index], a.fallback_finishPart)
        }
    };
    a.fallback_finishPart = function (b) {
        a.checkAndCancelTimeout();
        a.fallback_part_index < a.fallback_parts.length - 1 ? (a.fallback_part_index++,
            a.fallback_startPart()) : a.speech_onend()
    };
    a.cancel = function () {
        a.checkAndCancelTimeout();
        a.fallbackMode ? (null != a.fallback_audio && a.fallback_audio.pause(), a.clearFallbackPool()) : (a.cancelled = !0, speechSynthesis.cancel())
    };
    a.voiceSupport = function () {
        return "speechSynthesis"in window
    };
    a.OnFinishedPlaying = function (b) {
        if (null != a.msgparameters && null != a.msgparameters.onend)a.msgparameters.onend()
    };
    a.setDefaultVoice = function (b) {
        b = a.getResponsiveVoice(b);
        null != b && (a.default_rv = b)
    };
    a.mapRVs = function () {
        for (var b =
            0; b < a.responsivevoices.length; b++)for (var c = a.responsivevoices[b], e = 0; e < c.voiceIDs.length; e++) {
            var f = a.voicecollection[c.voiceIDs[e]];
            if (1 != f.fallbackvoice) {
                var d = a.getSystemVoice(f.name);
                if (null != d) {
                    c.mappedProfile = {systemvoice: d, collectionvoice: f};
                    break
                }
            } else {
                c.mappedProfile = {systemvoice: {}, collectionvoice: f};
                break
            }
        }
    };
    a.getMatchedVoice = function (b) {
        for (var c = 0; c < b.voiceIDs.length; c++) {
            var e = a.getSystemVoice(a.voicecollection[b.voiceIDs[c]].name);
            if (null != e)return e
        }
        return null
    };
    a.getSystemVoice =
        function (b) {
            if ("undefined" === typeof a.systemvoices || null === a.systemvoices)return null;
            for (var c = 0; c < a.systemvoices.length; c++)if (a.systemvoices[c].name == b)return a.systemvoices[c];
            return null
        };
    a.getResponsiveVoice = function (b) {
        for (var c = 0; c < a.responsivevoices.length; c++)if (a.responsivevoices[c].name == b)return a.responsivevoices[c];
        return null
    };
    a.Dispatch = function (b) {
        if (a.hasOwnProperty(b + "_callbacks") && null != a[b + "_callbacks"] && 0 < a[b + "_callbacks"].length) {
            for (var c = a[b + "_callbacks"], e = 0; e < c.length; e++)c[e]();
            return !0
        }
        var f = b + "_callbacks_timeout", d = b + "_callbacks_timeoutCount";
        a.hasOwnProperty(f) || (a[d] = 10, a[f] = setInterval(function () {
            --a[d];
            (a.Dispatch(b) || 0 > a[d]) && clearTimeout(a[f])
        }, 50));
        return !1
    };
    a.AddEventListener = function (b, c) {
        a.hasOwnProperty(b + "_callbacks") || (a[b + "_callbacks"] = []);
        a[b + "_callbacks"].push(c)
    };
    a.addEventListener = a.AddEventListener;
    a.clickEvent = function () {
        a.iOS && !a.iOS_initialized && (a.speak(" "), a.iOS_initialized = !0)
    };
    a.isPlaying = function () {
        return a.fallbackMode ? null != a.fallback_audio && !a.fallback_audio.ended && !a.fallback_audio.paused : speechSynthesis.speaking
    };
    a.clearFallbackPool = function () {
        for (var b = 0; b < a.fallback_audiopool.length; b++)null != a.fallback_audiopool[b] && (a.fallback_audiopool[b].pause(), a.fallback_audiopool[b].src = "");
        a.fallback_audiopool = []
    };
    "complete" === document.readyState ? a.init() : document.addEventListener("DOMContentLoaded", function () {
        a.init()
    });
    a.selectBest = function (a) {
        for (var c = 0; c < a.length; c++)if (null != a[c])return a[c];
        return null
    };
    a.pause = function () {
        a.fallbackMode ?
        null != a.fallback_audio && a.fallback_audio.pause() : speechSynthesis.pause()
    };
    a.resume = function () {
        a.fallbackMode ? null != a.fallback_audio && a.fallback_audio.play() : speechSynthesis.resume()
    };
    a.tts_speak = function (b) {
        setTimeout(function () {
            a.cancelled = !1;
            speechSynthesis.speak(b)
        }, .01)
    };
    a.setVolume = function (b) {
        if (a.isPlaying())if (a.fallbackMode) {
            for (var c = 0; c < a.fallback_parts.length; c++)a.fallback_parts[c].volume = b;
            for (c = 0; c < a.fallback_audiopool.length; c++)a.fallback_audiopool[c].volume = b;
            a.fallback_audio.volume =
                b
        } else for (c = 0; c < a.utterances.length; c++)a.utterances[c].volume = b
    };
    a.onPartEnd = function (b) {
        if (null != a.msgparameters && null != a.msgparameters.onchuckend)a.msgparameters.onchuckend();
        a.Dispatch("OnPartEnd");
        b = a.utterances.indexOf(b.utterance);
        a.currentMsg = a.utterances[b + 1]
    };
    a.onboundary = function (b) {
        console.log("On Boundary");
        a.iOS && !a.onstartFired && a.speech_onstart()
    }
}, responsiveVoice = new ResponsiveVoice;

//if (typeof responsiveVoice != 'undefined') {
//	console.log('ResponsiveVoice already loaded');
//	console.log(responsiveVoice);
//} else {
//
//	var ResponsiveVoice = function () {
//
//		var self = this;
//
//		self.version = 1;
//		console.log("ResponsiveVoice r" + self.version);
//
//		// Ourn own collection of voices
//		var responsivevoices = [
//			{name: 'UK English Female', voiceIDs: [3, 5, 1, 6, 7, 8]},
//			{name: 'UK English Male', voiceIDs: [0, 4, 2, 6, 7, 8]},
//			{name: 'US English Female', voiceIDs: [39, 40, 41, 42, 43, 44]},
//			{name: 'Spanish Female', voiceIDs: [19, 16, 17, 18, 20, 15]},
//			{name: 'French Female', voiceIDs: [21, 22, 23, 26]},
//			{name: 'Deutsch Female', voiceIDs: [27, 28, 29, 30, 31, 32]},
//			{name: 'Italian Female', voiceIDs: [33, 34, 35, 36, 37, 38]},
//			{name: 'Hungarian Female', voiceIDs: [9, 10, 11]},
//			{name: 'Dutch Female', voiceIDs: [45]},
//			{name: 'Serbian Male', voiceIDs: [12]},
//			{name: 'Croatian Male', voiceIDs: [13]},
//			{name: 'Bosnian Male', voiceIDs: [14]},
//			{name: 'Fallback UK Female', voiceIDs: [8]}
//
//		];
//
//		//All voices available on every system and device
//		var voicecollection = [
//			{name: 'Google UK English Male'}, //0 male uk android/chrome
//			{name: 'Agnes'}, //1 female us safari mac
//			{name: 'Daniel Compact'}, //2 male us safari mac
//			{name: 'Google UK English Female'}, //3 female uk android/chrome
//			{name: 'en-GB', rate: 0.25, pitch: 1}, //4 male uk IOS
//			{name: 'en-AU', rate: 0.25, pitch: 1}, //5 female english IOS
//
//			{name: 'inglГ©s Reino Unido'}, //6 spanish english android
//			{name: 'English United Kingdom'}, //7 english english android
//			{name: 'Fallback en-GB Female', lang: 'en-GB', fallbackvoice: true}, //8 fallback english female
//
//			{name: 'Eszter Compact'}, //9 Hungarian mac
//			{name: 'hu-HU', rate: 0.4}, //10 Hungarian iOS
//			{name: 'Fallback Hungarian', lang: 'hu', fallbackvoice: true}, //11 Hungarian fallback
//			{name: 'Fallback Serbian', lang: 'sr', fallbackvoice: true}, //12 Serbian fallback
//			{name: 'Fallback Croatian', lang: 'hr', fallbackvoice: true}, //13 Croatian fallback
//			{name: 'Fallback Bosnian', lang: 'bs', fallbackvoice: true}, //14 Bosnian fallback
//
//			{name: 'Fallback Spanish', lang: 'es', fallbackvoice: true}, //15 Spanish fallback
//			{name: 'Spanish Spain'}, //16 female es android/chrome
//			{name: 'espaГ±ol EspaГ±a'}, //17 female es android/chrome
//			{name: 'Diego Compact', rate: 0.3}, //18 male es mac
//			{name: 'Google EspaГ±ol'}, //19 male es chrome
//			{name: 'es-ES', rate: 0.20}, //20 male es iOS
//
//			{name: 'Google FranГ§ais'}, //21 FR chrome
//			{name: 'French France'}, //22 android/chrome
//			{name: 'francГ©s Francia'}, //23 android/chrome
//			{name: 'Virginie Compact', rate: 0.5}, //24 mac
//			{name: 'fr-FR', rate: 0.25}, //25 iOS
//			{name: 'Fallback French', lang: 'fr', fallbackvoice: true}, //26 fallback
//
//			{name: 'Google Deutsch'}, //27 DE chrome
//			{name: 'German Germany'}, //28 android/chrome
//			{name: 'alemГЎn Alemania'}, //29 android/chrome
//			{name: 'Yannick Compact', rate: 0.5}, //30 mac
//			{name: 'de-DE', rate: 0.25}, //31 iOS
//			{name: 'Fallback Deutsch', lang: 'de', fallbackvoice: true}, //32 fallback
//
//			{name: 'Google Italiano'}, //33 IT chrome
//			{name: 'Italian Italy'}, //34 android/chrome
//			{name: 'italiano Italia'}, //35 android/chrome
//			{name: 'Paolo Compact', rate: 0.5}, //36 mac
//			{name: 'it-IT', rate: 0.25}, //37 iOS
//			{name: 'Fallback Italian', lang: 'it', fallbackvoice: true}, //38 fallback
//
//			{name: 'Google US English', timerSpeed:1}, //39 EN chrome
//			{name: 'English United States'}, //40 android/chrome
//			{name: 'inglГ©s Estados Unidos'}, //41 android/chrome
//			{name: 'Vicki'}, //42 mac
//			{name: 'en-US', rate: 0.2, pitch: 1, timerSpeed:1.3}, //43 iOS
//			{name: 'Fallback English', lang: 'en-US', fallbackvoice: true, timerSpeed:0}, //44 fallback
//			{name: 'Fallback Dutch', lang: 'nl', fallbackvoice: true, timerSpeed:0}, //45 fallback
//		];
//
//		self.iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
//
//		//Fallback cache voices
//		var cache_ios_voices = [{"name":"he-IL","voiceURI":"he-IL","lang":"he-IL"},{"name":"th-TH","voiceURI":"th-TH","lang":"th-TH"},{"name":"pt-BR","voiceURI":"pt-BR","lang":"pt-BR"},{"name":"sk-SK","voiceURI":"sk-SK","lang":"sk-SK"},{"name":"fr-CA","voiceURI":"fr-CA","lang":"fr-CA"},{"name":"ro-RO","voiceURI":"ro-RO","lang":"ro-RO"},{"name":"no-NO","voiceURI":"no-NO","lang":"no-NO"},{"name":"fi-FI","voiceURI":"fi-FI","lang":"fi-FI"},{"name":"pl-PL","voiceURI":"pl-PL","lang":"pl-PL"},{"name":"de-DE","voiceURI":"de-DE","lang":"de-DE"},{"name":"nl-NL","voiceURI":"nl-NL","lang":"nl-NL"},{"name":"id-ID","voiceURI":"id-ID","lang":"id-ID"},{"name":"tr-TR","voiceURI":"tr-TR","lang":"tr-TR"},{"name":"it-IT","voiceURI":"it-IT","lang":"it-IT"},{"name":"pt-PT","voiceURI":"pt-PT","lang":"pt-PT"},{"name":"fr-FR","voiceURI":"fr-FR","lang":"fr-FR"},{"name":"ru-RU","voiceURI":"ru-RU","lang":"ru-RU"},{"name":"es-MX","voiceURI":"es-MX","lang":"es-MX"},{"name":"zh-HK","voiceURI":"zh-HK","lang":"zh-HK"},{"name":"sv-SE","voiceURI":"sv-SE","lang":"sv-SE"},{"name":"hu-HU","voiceURI":"hu-HU","lang":"hu-HU"},{"name":"zh-TW","voiceURI":"zh-TW","lang":"zh-TW"},{"name":"es-ES","voiceURI":"es-ES","lang":"es-ES"},{"name":"zh-CN","voiceURI":"zh-CN","lang":"zh-CN"},{"name":"nl-BE","voiceURI":"nl-BE","lang":"nl-BE"},{"name":"en-GB","voiceURI":"en-GB","lang":"en-GB"},{"name":"ar-SA","voiceURI":"ar-SA","lang":"ar-SA"},{"name":"ko-KR","voiceURI":"ko-KR","lang":"ko-KR"},{"name":"cs-CZ","voiceURI":"cs-CZ","lang":"cs-CZ"},{"name":"en-ZA","voiceURI":"en-ZA","lang":"en-ZA"},{"name":"en-AU","voiceURI":"en-AU","lang":"en-AU"},{"name":"da-DK","voiceURI":"da-DK","lang":"da-DK"},{"name":"en-US","voiceURI":"en-US","lang":"en-US"},{"name":"en-IE","voiceURI":"en-IE","lang":"en-IE"},{"name":"hi-IN","voiceURI":"hi-IN","lang":"hi-IN"},{"name":"el-GR","voiceURI":"el-GR","lang":"el-GR"},{"name":"ja-JP","voiceURI":"ja-JP","lang":"ja-JP"}];
//
//
//
//
//		var systemvoices;
//
//		var CHARACTER_LIMIT = 100;
//		var VOICESUPPORT_ATTEMPTLIMIT = 5;
//		var voicesupport_attempts = 0;
//		var fallbackMode = false;
//		var WORDS_PER_MINUTE = 140;
//
//		self.fallback_playing = false;
//		self.fallback_parts = null;
//		self.fallback_part_index = 0;
//		self.fallback_audio = null;
//		self.msgparameters = null;
//		self.timeoutId = null;
//
//		//Wait until system voices are ready and trigger the event OnVoiceReady
//		if (typeof speechSynthesis != 'undefined') {
//			speechSynthesis.onvoiceschanged = function () {
//
//				systemvoices = window.speechSynthesis.getVoices();
//
//				if (self.OnVoiceReady != null) {
//					self.OnVoiceReady.call();
//				}
//			};
//		}
//
//		self.default_rv = responsivevoices[0];
//
//
//
//		self.OnVoiceReady = null;
//
//
//		//We should use jQuery if it's available
//		if (typeof $ === 'undefined') {
//			document.addEventListener('DOMContentLoaded', function () {
//				init();
//			});
//		} else {
//
//			$(document).ready(function () {
//				init();
//			});
//		}
//
//		function init() {
//
//			//Disable RV on IOS temporally
//			/*if (self.iOS) {
//			 enableFallbackMode();
//			 return;
//			 }*/
//
//
//			if (typeof speechSynthesis === 'undefined') {
//
//				console.log('RV: Voice synthesis not supported');
//				enableFallbackMode();
//
//			} else {
//
//
//				//Waiting a few ms before calling getVoices() fixes some issues with safari on IOS as well as Chrome
//				setTimeout(function () {
//					var gsvinterval = setInterval(function () {
//
//						var v = window.speechSynthesis.getVoices();
//
//						if (v.length == 0 && (systemvoices == null || systemvoices.length == 0)) {
//							//console.log('Voice support NOT ready');
//
//							voicesupport_attempts++;
//							if (voicesupport_attempts > VOICESUPPORT_ATTEMPTLIMIT) {
//
//								clearInterval(gsvinterval);
//
//								//On IOS, sometimes getVoices is just empty, but speech works. So we use a cached voice collection.
//								if (window.speechSynthesis != null) {
//
//									if (self.iOS) {
//
//										console.log('RV: Voice support ready (cached)');
//										systemVoicesReady(cache_ios_voices);
//
//									}else{
//
//										console.log("RV: speechSynthesis present but no system voices found");
//										enableFallbackMode();
//									}
//
//								} else {
//
//									//We don't support voices. Using fallback
//									enableFallbackMode();
//								}
//							}
//
//						} else {
//
//							console.log('RV: Voice support ready');
//							systemVoicesReady(v);
//
//							clearInterval(gsvinterval);
//
//						}
//
//					}, 100);
//				}, 100);
//			}
//		}
//
//		function systemVoicesReady(v) {
//			systemvoices = v;
//
//			mapRVs();
//
//			if (self.OnVoiceReady != null)
//				self.OnVoiceReady.call();
//		}
//
//		function enableFallbackMode() {
//
//			fallbackMode = true;
//			console.log('RV: Enabling fallback mode');
//
//			mapRVs();
//
//			if (self.OnVoiceReady != null)
//				self.OnVoiceReady.call();
//
//
//		}
//
//
//		self.getVoices = function () {
//
//			//Create voices array
//
//			var v = [];
//
//			for (var i = 0; i < responsivevoices.length; i++) {
//				v.push({name: responsivevoices[i].name});
//			}
//
//			return v;
//
//		}
//
//
//		self.speak = function (text, voicename, parameters) {
//
//			self.msgparameters = parameters ||  {};
//			self.msgtext = text;
//			self.msgvoicename = voicename;
//
//			//Support for multipart text (there is a limit on characters)
//			var multipartText = [];
//
//			if (text.length > CHARACTER_LIMIT) {
//
//				var tmptxt = text;
//
//				while (tmptxt.length > CHARACTER_LIMIT) {
//
//					//Split by common phrase delimiters
//					var p = tmptxt.search(/[:!?.;]+/);
//					var part = '';
//
//					//Coludn't split by priority characters, try commas
//					if (p == -1 || p >= CHARACTER_LIMIT) {
//						p = tmptxt.search(/[,]+/);
//					}
//
//					//Couldn't split by normal characters, then we use spaces
//					if (p == -1 || p >= CHARACTER_LIMIT) {
//
//						var words = tmptxt.split(' ');
//
//						for (var i = 0; i < words.length; i++) {
//
//							if (part.length + words[i].length + 1 > CHARACTER_LIMIT)
//								break;
//
//							part += (i != 0 ? ' ' : '') + words[i];
//
//						}
//
//					} else {
//
//						part = tmptxt.substr(0, p + 1);
//
//					}
//
//					tmptxt = tmptxt.substr(part.length, tmptxt.length - part.length);
//
//					multipartText.push(part);
//					//console.log(part.length + " - " + part);
//
//				}
//
//				//Add the remaining text
//				if (tmptxt.length > 0) {
//					multipartText.push(tmptxt);
//				}
//
//			} else {
//
//				//Small text
//				multipartText.push(text);
//			}
//
//
//			//Find system voice that matches voice name
//			var rv;
//
//			if (voicename == null) {
//				rv = self.default_rv;
//			} else {
//				rv = getResponsiveVoice(voicename);
//			}
//
//			var profile = {};
//
//
//
//
//			//Map was done so no need to look for the mapped voice
//			if (rv.mappedProfile != null) {
//
//				profile = rv.mappedProfile;
//
//			} else {
//
//				profile.systemvoice = getMatchedVoice(rv);
//				profile.collectionvoice = {};
//
//				if (profile.systemvoice == null) {
//					console.log('RV: ERROR: No voice found for: ' + voicename);
//					return;
//				}
//			}
//
//
//			if (profile.collectionvoice.fallbackvoice == true) {
//				fallbackMode = true;
//				self.fallback_parts = [];
//			} else {
//				fallbackMode = false;
//			}
//
//			self.msgprofile = profile;
//			//console.log("Start multipart play");
//
//			//Play multipart text
//			for (var i = 0; i < multipartText.length; i++) {
//
//				if (!fallbackMode) {
//					//Use SpeechSynthesis
//
//					//Create msg object
//					var msg = new SpeechSynthesisUtterance();
//					msg.voice = profile.systemvoice;
//					msg.voiceURI = profile.systemvoice.voiceURI;
//					msg.volume = profile.collectionvoice.volume || profile.systemvoice.volume || 1; // 0 to 1
//					msg.rate = profile.collectionvoice.rate || profile.systemvoice.rate || 1; // 0.1 to 10
//					msg.pitch = profile.collectionvoice.pitch || profile.systemvoice.pitch || 1; //0 to 2*/
//					msg.text = multipartText[i];
//					msg.lang = profile.collectionvoice.lang || profile.systemvoice.lang;
//					msg.rvIndex = i;
//					msg.rvTotal = multipartText.length;
//
//					if (i == 0) {
//						msg.onstart = self.speech_onstart;
//					}
//					self.msgparameters.onendcalled = false;
//
//					if (parameters != null) {
//
//
//
//						if (i < multipartText.length - 1 && multipartText.length > 1) {
//							msg.onend = parameters.onchunkend;
//							msg.addEventListener('end',parameters.onchuckend);
//						} else {
//							msg.onend = self.speech_onend;
//							msg.addEventListener('end',self.speech_onend);
//						}
//
//
//
//						msg.onerror = parameters.onerror || function (e) {
//							console.log('RV: Error');
//							console.log(e);
//						};
//
//						msg.onpause = parameters.onpause;
//						msg.onresume = parameters.onresume;
//						msg.onmark = parameters.onmark;
//						msg.onboundary = parameters.onboundary;
//					} else {
//						msg.onend = self.speech_onend;
//						msg.onerror = function (e) {
//							console.log('RV: Error');
//							console.log(e);
//						};
//					}
//					//console.log(JSON.stringify(msg));
//					speechSynthesis.speak(msg);
//
//				} else {
//
//					//var url = 'http://www.corsproxy.com/translate.google.com/translate_tts?ie=UTF-8&q=' + multipartText[i] + '&tl=' + profile.collectionvoice.lang || profile.systemvoice.lang || 'en-US';
//					var url = 'http://responsivevoice.org/responsivevoice/getvoice.php?t=' + multipartText[i]+ '&tl=' + profile.collectionvoice.lang || profile.systemvoice.lang || 'en-US';
//					var audio = new Audio(url);
//					audio.playbackRate = 1;
//					audio.preload = 'auto';
//					audio.volume = profile.collectionvoice.volume || profile.systemvoice.volume || 1; // 0 to 1;
//					self.fallback_parts.push(audio);
//					//console.log(audio);
//
//
//				}
//
//
//			}
//
//			if (fallbackMode) {
//
//
//				self.fallback_part_index = 0;
//				self.fallback_startPart();
//
//			}
//
//		}
//
//		self.startTimeout = function (text, callback) {
//
//			//if (self.iOS) {
//			//   multiplier = 0.5;
//			//}
//
//			var multiplier = self.msgprofile.collectionvoice.timerSpeed;
//			if (self.msgprofile.collectionvoice.timerSpeed==null)
//				multiplier = 1;
//
//			//console.log(self.msgprofile.collectionvoice.name);
//			if (multiplier <=0)
//				return;
//
//			self.timeoutId = setTimeout(callback, multiplier * 1000 * (60 / WORDS_PER_MINUTE) * text.split(/\s+/).length); //avg 140 words per minute read time
//			//console.log("Timeout " + self.timeoutId + " started: " + (multiplier * 1000 * (60 / WORDS_PER_MINUTE) * text.split(/\s+/).length).toString());
//		}
//
//		self.checkAndCancelTimeout = function () {
//			if (self.timeoutId != null) {
//				//console.log("Timeout " + self.timeoutId + " cancelled");
//				clearTimeout(self.timeoutId);
//				self.timeoutId = null;
//			}
//		}
//
//		self.speech_timedout = function() {
//			//console.log("Speech cancelled: Timeout " + self.timeoutId + " ended");
//			self.cancel();
//			//if (!self.iOS) //On iOS, cancel calls msg.onend
//			self.speech_onend();
//
//		}
//
//		self.speech_onend = function () {
//			self.checkAndCancelTimeout();
//
//			//Avoid this being automatically called just after calling speechSynthesis.cancel
//			if (self.cancelled === true) {
//				self.cancelled = false;
//				return;
//			}
//
//			//console.log("on end fired");
//			if (self.msgparameters != null && self.msgparameters.onend != null && self.msgparameters.onendcalled!=true) {
//				//console.log("Speech on end called  -" + self.msgtext);
//				self.msgparameters.onendcalled=true;
//				self.msgparameters.onend();
//
//			}
//
//		}
//
//		self.speech_onstart = function () {
//			//if (!self.iOS)
//			//console.log("Speech start");
//			if (self.iOS)
//				self.startTimeout(self.msgtext,self.speech_timedout);
//
//			self.msgparameters.onendcalled=false;
//			if (self.msgparameters != null && self.msgparameters.onstart != null) {
//				self.msgparameters.onstart();
//			}
//
//		}
//
//
//
//		self.fallback_startPart = function () {
//
//			if (self.fallback_part_index == 0) {
//				self.speech_onstart();
//			}
//
//			self.fallback_audio = self.fallback_parts[self.fallback_part_index];
//
//			if (self.fallback_audio == null) {
//
//				//Fallback audio is not working. Just wait for the timeout event
//				console.log("RV: Fallback Audio is not available");
//
//			} else {
//
//				self.fallback_audio.play();
//				self.fallback_audio.addEventListener('ended', self.fallback_finishPart);
//			}
//		}
//
//		self.fallback_finishPart = function (e) {
//
//			self.checkAndCancelTimeout();
//
//			if (self.fallback_part_index < self.fallback_parts.length - 1) {
//				//console.log('chunk ended');
//				self.fallback_part_index++;
//				self.fallback_startPart();
//
//			} else {
//				//console.log('msg ended');
//				self.speech_onend();
//
//			}
//
//		}
//
//
//		self.cancel = function () {
//
//			self.checkAndCancelTimeout();
//
//			if (fallbackMode){
//				if (self.fallback_audio!=null)
//					self.fallback_audio.pause();
//			}else{
//				self.cancelled = true;
//				speechSynthesis.cancel();
//
//			}
//		}
//
//
//		self.voiceSupport = function () {
//
//			return ('speechSynthesis' in window);
//
//		}
//
//		self.OnFinishedPlaying = function (event) {
//			//console.log("OnFinishedPlaying");
//			if (self.msgparameters != null) {
//				if (self.msgparameters.onend != null)
//					self.msgparameters.onend();
//			}
//
//		}
//
//		//Set default voice to use when no voice name is supplied to speak()
//		self.setDefaultVoice = function (voicename) {
//
//			var vr = getResponsiveVoice(voicename);
//
//			if (vr != null) {
//				self.default_vr = vr;
//			}
//
//		}
//
//		//Map responsivevoices to system voices
//		function mapRVs() {
//
//			for (var i = 0; i < responsivevoices.length; i++) {
//
//				var rv = responsivevoices[i];
//
//				for (var j = 0; j < rv.voiceIDs.length; j++) {
//
//					var vcoll = voicecollection[rv.voiceIDs[j]];
//
//					if (vcoll.fallbackvoice != true) {		// vcoll.fallbackvoice would be null instead of false
//
//						// Look on system voices
//						var v = getSystemVoice(vcoll.name);
//						if (v != null) {
//							rv.mappedProfile = {
//								systemvoice: v,
//								collectionvoice: vcoll
//							};
//							//console.log("Mapped " + rv.name + " to " + v.name);
//							break;
//						}
//
//					} else {
//
//						//Pick the fallback voice
//						rv.mappedProfile = {
//							systemvoice: {},
//							collectionvoice: vcoll
//						};
//						//console.log("Mapped " + rv.name + " to " + vcoll.lang + " fallback voice");
//						break;
//
//					}
//				}
//			}
//
//
//		}
//
//
//		//Look for the voice in the system that matches the one in our collection
//		function getMatchedVoice(rv) {
//
//			for (var i = 0; i < rv.voiceIDs.length; i++) {
//				var v = getSystemVoice(voicecollection[rv.voiceIDs[i]].name);
//				if (v != null)
//					return v;
//			}
//
//			return null;
//
//		}
//
//		function getSystemVoice(name) {
//
//			if (typeof systemvoices === 'undefined')
//				return null;
//
//			for (var i = 0; i < systemvoices.length; i++) {
//				if (systemvoices[i].name == name)
//					return systemvoices[i];
//			}
//
//			return null;
//
//		}
//
//		function getResponsiveVoice(name) {
//
//			for (var i = 0; i < responsivevoices.length; i++) {
//				if (responsivevoices[i].name == name) {
//					return responsivevoices[i];
//				}
//			}
//
//			return null;
//
//		}
//
//	}
//	var responsiveVoice = new ResponsiveVoice();
//}