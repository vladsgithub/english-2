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
if (typeof responsiveVoice != 'undefined') {
	console.log('ResponsiveVoice already loaded');
	console.log(responsiveVoice);
} else {

	var ResponsiveVoice = function () {

		var self = this;

		self.version = 1;
		console.log("ResponsiveVoice r" + self.version);

		// Ourn own collection of voices
		var responsivevoices = [
			{name: 'UK English Female', voiceIDs: [3, 5, 1, 6, 7, 8]},
			{name: 'UK English Male', voiceIDs: [0, 4, 2, 6, 7, 8]},
			{name: 'US English Female', voiceIDs: [39, 40, 41, 42, 43, 44]},
			{name: 'Spanish Female', voiceIDs: [19, 16, 17, 18, 20, 15]},
			{name: 'French Female', voiceIDs: [21, 22, 23, 26]},
			{name: 'Deutsch Female', voiceIDs: [27, 28, 29, 30, 31, 32]},
			{name: 'Italian Female', voiceIDs: [33, 34, 35, 36, 37, 38]},
			{name: 'Hungarian Female', voiceIDs: [9, 10, 11]},
			{name: 'Dutch Female', voiceIDs: [45]},
			{name: 'Serbian Male', voiceIDs: [12]},
			{name: 'Croatian Male', voiceIDs: [13]},
			{name: 'Bosnian Male', voiceIDs: [14]},
			{name: 'Fallback UK Female', voiceIDs: [8]}

		];

		//All voices available on every system and device
		var voicecollection = [
			{name: 'Google UK English Male'}, //0 male uk android/chrome
			{name: 'Agnes'}, //1 female us safari mac
			{name: 'Daniel Compact'}, //2 male us safari mac
			{name: 'Google UK English Female'}, //3 female uk android/chrome
			{name: 'en-GB', rate: 0.25, pitch: 1}, //4 male uk IOS
			{name: 'en-AU', rate: 0.25, pitch: 1}, //5 female english IOS

			{name: 'inglГ©s Reino Unido'}, //6 spanish english android
			{name: 'English United Kingdom'}, //7 english english android
			{name: 'Fallback en-GB Female', lang: 'en-GB', fallbackvoice: true}, //8 fallback english female

			{name: 'Eszter Compact'}, //9 Hungarian mac
			{name: 'hu-HU', rate: 0.4}, //10 Hungarian iOS
			{name: 'Fallback Hungarian', lang: 'hu', fallbackvoice: true}, //11 Hungarian fallback
			{name: 'Fallback Serbian', lang: 'sr', fallbackvoice: true}, //12 Serbian fallback
			{name: 'Fallback Croatian', lang: 'hr', fallbackvoice: true}, //13 Croatian fallback
			{name: 'Fallback Bosnian', lang: 'bs', fallbackvoice: true}, //14 Bosnian fallback

			{name: 'Fallback Spanish', lang: 'es', fallbackvoice: true}, //15 Spanish fallback
			{name: 'Spanish Spain'}, //16 female es android/chrome
			{name: 'espaГ±ol EspaГ±a'}, //17 female es android/chrome
			{name: 'Diego Compact', rate: 0.3}, //18 male es mac
			{name: 'Google EspaГ±ol'}, //19 male es chrome
			{name: 'es-ES', rate: 0.20}, //20 male es iOS

			{name: 'Google FranГ§ais'}, //21 FR chrome
			{name: 'French France'}, //22 android/chrome
			{name: 'francГ©s Francia'}, //23 android/chrome
			{name: 'Virginie Compact', rate: 0.5}, //24 mac
			{name: 'fr-FR', rate: 0.25}, //25 iOS
			{name: 'Fallback French', lang: 'fr', fallbackvoice: true}, //26 fallback

			{name: 'Google Deutsch'}, //27 DE chrome
			{name: 'German Germany'}, //28 android/chrome
			{name: 'alemГЎn Alemania'}, //29 android/chrome
			{name: 'Yannick Compact', rate: 0.5}, //30 mac
			{name: 'de-DE', rate: 0.25}, //31 iOS
			{name: 'Fallback Deutsch', lang: 'de', fallbackvoice: true}, //32 fallback

			{name: 'Google Italiano'}, //33 IT chrome
			{name: 'Italian Italy'}, //34 android/chrome
			{name: 'italiano Italia'}, //35 android/chrome
			{name: 'Paolo Compact', rate: 0.5}, //36 mac
			{name: 'it-IT', rate: 0.25}, //37 iOS
			{name: 'Fallback Italian', lang: 'it', fallbackvoice: true}, //38 fallback

			{name: 'Google US English', timerSpeed:1}, //39 EN chrome
			{name: 'English United States'}, //40 android/chrome
			{name: 'inglГ©s Estados Unidos'}, //41 android/chrome
			{name: 'Vicki'}, //42 mac
			{name: 'en-US', rate: 0.2, pitch: 1, timerSpeed:1.3}, //43 iOS
			{name: 'Fallback English', lang: 'en-US', fallbackvoice: true, timerSpeed:0}, //44 fallback
			{name: 'Fallback Dutch', lang: 'nl', fallbackvoice: true, timerSpeed:0}, //45 fallback
		];

		self.iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

		//Fallback cache voices
		var cache_ios_voices = [{"name":"he-IL","voiceURI":"he-IL","lang":"he-IL"},{"name":"th-TH","voiceURI":"th-TH","lang":"th-TH"},{"name":"pt-BR","voiceURI":"pt-BR","lang":"pt-BR"},{"name":"sk-SK","voiceURI":"sk-SK","lang":"sk-SK"},{"name":"fr-CA","voiceURI":"fr-CA","lang":"fr-CA"},{"name":"ro-RO","voiceURI":"ro-RO","lang":"ro-RO"},{"name":"no-NO","voiceURI":"no-NO","lang":"no-NO"},{"name":"fi-FI","voiceURI":"fi-FI","lang":"fi-FI"},{"name":"pl-PL","voiceURI":"pl-PL","lang":"pl-PL"},{"name":"de-DE","voiceURI":"de-DE","lang":"de-DE"},{"name":"nl-NL","voiceURI":"nl-NL","lang":"nl-NL"},{"name":"id-ID","voiceURI":"id-ID","lang":"id-ID"},{"name":"tr-TR","voiceURI":"tr-TR","lang":"tr-TR"},{"name":"it-IT","voiceURI":"it-IT","lang":"it-IT"},{"name":"pt-PT","voiceURI":"pt-PT","lang":"pt-PT"},{"name":"fr-FR","voiceURI":"fr-FR","lang":"fr-FR"},{"name":"ru-RU","voiceURI":"ru-RU","lang":"ru-RU"},{"name":"es-MX","voiceURI":"es-MX","lang":"es-MX"},{"name":"zh-HK","voiceURI":"zh-HK","lang":"zh-HK"},{"name":"sv-SE","voiceURI":"sv-SE","lang":"sv-SE"},{"name":"hu-HU","voiceURI":"hu-HU","lang":"hu-HU"},{"name":"zh-TW","voiceURI":"zh-TW","lang":"zh-TW"},{"name":"es-ES","voiceURI":"es-ES","lang":"es-ES"},{"name":"zh-CN","voiceURI":"zh-CN","lang":"zh-CN"},{"name":"nl-BE","voiceURI":"nl-BE","lang":"nl-BE"},{"name":"en-GB","voiceURI":"en-GB","lang":"en-GB"},{"name":"ar-SA","voiceURI":"ar-SA","lang":"ar-SA"},{"name":"ko-KR","voiceURI":"ko-KR","lang":"ko-KR"},{"name":"cs-CZ","voiceURI":"cs-CZ","lang":"cs-CZ"},{"name":"en-ZA","voiceURI":"en-ZA","lang":"en-ZA"},{"name":"en-AU","voiceURI":"en-AU","lang":"en-AU"},{"name":"da-DK","voiceURI":"da-DK","lang":"da-DK"},{"name":"en-US","voiceURI":"en-US","lang":"en-US"},{"name":"en-IE","voiceURI":"en-IE","lang":"en-IE"},{"name":"hi-IN","voiceURI":"hi-IN","lang":"hi-IN"},{"name":"el-GR","voiceURI":"el-GR","lang":"el-GR"},{"name":"ja-JP","voiceURI":"ja-JP","lang":"ja-JP"}];




		var systemvoices;

		var CHARACTER_LIMIT = 100;
		var VOICESUPPORT_ATTEMPTLIMIT = 5;
		var voicesupport_attempts = 0;
		var fallbackMode = false;
		var WORDS_PER_MINUTE = 140;

		self.fallback_playing = false;
		self.fallback_parts = null;
		self.fallback_part_index = 0;
		self.fallback_audio = null;
		self.msgparameters = null;
		self.timeoutId = null;

		//Wait until system voices are ready and trigger the event OnVoiceReady
		if (typeof speechSynthesis != 'undefined') {
			speechSynthesis.onvoiceschanged = function () {

				systemvoices = window.speechSynthesis.getVoices();

				if (self.OnVoiceReady != null) {
					self.OnVoiceReady.call();
				}
			};
		}

		self.default_rv = responsivevoices[0];



		self.OnVoiceReady = null;


		//We should use jQuery if it's available
		if (typeof $ === 'undefined') {
			document.addEventListener('DOMContentLoaded', function () {
				init();
			});
		} else {

			$(document).ready(function () {
				init();
			});
		}

		function init() {

			//Disable RV on IOS temporally
			/*if (self.iOS) {
			 enableFallbackMode();
			 return;
			 }*/


			if (typeof speechSynthesis === 'undefined') {

				console.log('RV: Voice synthesis not supported');
				enableFallbackMode();

			} else {


				//Waiting a few ms before calling getVoices() fixes some issues with safari on IOS as well as Chrome
				setTimeout(function () {
					var gsvinterval = setInterval(function () {

						var v = window.speechSynthesis.getVoices();

						if (v.length == 0 && (systemvoices == null || systemvoices.length == 0)) {
							//console.log('Voice support NOT ready');

							voicesupport_attempts++;
							if (voicesupport_attempts > VOICESUPPORT_ATTEMPTLIMIT) {

								clearInterval(gsvinterval);

								//On IOS, sometimes getVoices is just empty, but speech works. So we use a cached voice collection.
								if (window.speechSynthesis != null) {

									if (self.iOS) {

										console.log('RV: Voice support ready (cached)');
										systemVoicesReady(cache_ios_voices);

									}else{

										console.log("RV: speechSynthesis present but no system voices found");
										enableFallbackMode();
									}

								} else {

									//We don't support voices. Using fallback
									enableFallbackMode();
								}
							}

						} else {

							console.log('RV: Voice support ready');
							systemVoicesReady(v);

							clearInterval(gsvinterval);

						}

					}, 100);
				}, 100);
			}
		}

		function systemVoicesReady(v) {
			systemvoices = v;

			mapRVs();

			if (self.OnVoiceReady != null)
				self.OnVoiceReady.call();
		}

		function enableFallbackMode() {

			fallbackMode = true;
			console.log('RV: Enabling fallback mode');

			mapRVs();

			if (self.OnVoiceReady != null)
				self.OnVoiceReady.call();


		}


		self.getVoices = function () {

			//Create voices array

			var v = [];

			for (var i = 0; i < responsivevoices.length; i++) {
				v.push({name: responsivevoices[i].name});
			}

			return v;

		}


		self.speak = function (text, voicename, parameters) {

			self.msgparameters = parameters ||  {};
			self.msgtext = text;
			self.msgvoicename = voicename;

			//Support for multipart text (there is a limit on characters)
			var multipartText = [];

			if (text.length > CHARACTER_LIMIT) {

				var tmptxt = text;

				while (tmptxt.length > CHARACTER_LIMIT) {

					//Split by common phrase delimiters
					var p = tmptxt.search(/[:!?.;]+/);
					var part = '';

					//Coludn't split by priority characters, try commas
					if (p == -1 || p >= CHARACTER_LIMIT) {
						p = tmptxt.search(/[,]+/);
					}

					//Couldn't split by normal characters, then we use spaces
					if (p == -1 || p >= CHARACTER_LIMIT) {

						var words = tmptxt.split(' ');

						for (var i = 0; i < words.length; i++) {

							if (part.length + words[i].length + 1 > CHARACTER_LIMIT)
								break;

							part += (i != 0 ? ' ' : '') + words[i];

						}

					} else {

						part = tmptxt.substr(0, p + 1);

					}

					tmptxt = tmptxt.substr(part.length, tmptxt.length - part.length);

					multipartText.push(part);
					//console.log(part.length + " - " + part);

				}

				//Add the remaining text
				if (tmptxt.length > 0) {
					multipartText.push(tmptxt);
				}

			} else {

				//Small text
				multipartText.push(text);
			}


			//Find system voice that matches voice name
			var rv;

			if (voicename == null) {
				rv = self.default_rv;
			} else {
				rv = getResponsiveVoice(voicename);
			}

			var profile = {};




			//Map was done so no need to look for the mapped voice
			if (rv.mappedProfile != null) {

				profile = rv.mappedProfile;

			} else {

				profile.systemvoice = getMatchedVoice(rv);
				profile.collectionvoice = {};

				if (profile.systemvoice == null) {
					console.log('RV: ERROR: No voice found for: ' + voicename);
					return;
				}
			}


			if (profile.collectionvoice.fallbackvoice == true) {
				fallbackMode = true;
				self.fallback_parts = [];
			} else {
				fallbackMode = false;
			}

			self.msgprofile = profile;
			//console.log("Start multipart play");

			//Play multipart text
			for (var i = 0; i < multipartText.length; i++) {

				if (!fallbackMode) {
					//Use SpeechSynthesis

					//Create msg object
					var msg = new SpeechSynthesisUtterance();
					msg.voice = profile.systemvoice;
					msg.voiceURI = profile.systemvoice.voiceURI;
					msg.volume = profile.collectionvoice.volume || profile.systemvoice.volume || 1; // 0 to 1
					msg.rate = profile.collectionvoice.rate || profile.systemvoice.rate || 1; // 0.1 to 10
					msg.pitch = profile.collectionvoice.pitch || profile.systemvoice.pitch || 1; //0 to 2*/
					msg.text = multipartText[i];
					msg.lang = profile.collectionvoice.lang || profile.systemvoice.lang;
					msg.rvIndex = i;
					msg.rvTotal = multipartText.length;

					if (i == 0) {
						msg.onstart = self.speech_onstart;
					}
					self.msgparameters.onendcalled = false;

					if (parameters != null) {



						if (i < multipartText.length - 1 && multipartText.length > 1) {
							msg.onend = parameters.onchunkend;
							msg.addEventListener('end',parameters.onchuckend);
						} else {
							msg.onend = self.speech_onend;
							msg.addEventListener('end',self.speech_onend);
						}



						msg.onerror = parameters.onerror || function (e) {
							console.log('RV: Error');
							console.log(e);
						};

						msg.onpause = parameters.onpause;
						msg.onresume = parameters.onresume;
						msg.onmark = parameters.onmark;
						msg.onboundary = parameters.onboundary;
					} else {
						msg.onend = self.speech_onend;
						msg.onerror = function (e) {
							console.log('RV: Error');
							console.log(e);
						};
					}
					//console.log(JSON.stringify(msg));
					speechSynthesis.speak(msg);

				} else {

					//var url = 'http://www.corsproxy.com/translate.google.com/translate_tts?ie=UTF-8&q=' + multipartText[i] + '&tl=' + profile.collectionvoice.lang || profile.systemvoice.lang || 'en-US';
					var url = 'http://responsivevoice.org/responsivevoice/getvoice.php?t=' + multipartText[i]+ '&tl=' + profile.collectionvoice.lang || profile.systemvoice.lang || 'en-US';
					var audio = new Audio(url);
					audio.playbackRate = 1;
					audio.preload = 'auto';
					audio.volume = profile.collectionvoice.volume || profile.systemvoice.volume || 1; // 0 to 1;
					self.fallback_parts.push(audio);
					//console.log(audio);


				}


			}

			if (fallbackMode) {


				self.fallback_part_index = 0;
				self.fallback_startPart();

			}

		}

		self.startTimeout = function (text, callback) {

			//if (self.iOS) {
			//   multiplier = 0.5;
			//}

			var multiplier = self.msgprofile.collectionvoice.timerSpeed;
			if (self.msgprofile.collectionvoice.timerSpeed==null)
				multiplier = 1;

			//console.log(self.msgprofile.collectionvoice.name);
			if (multiplier <=0)
				return;

			self.timeoutId = setTimeout(callback, multiplier * 1000 * (60 / WORDS_PER_MINUTE) * text.split(/\s+/).length); //avg 140 words per minute read time
			//console.log("Timeout " + self.timeoutId + " started: " + (multiplier * 1000 * (60 / WORDS_PER_MINUTE) * text.split(/\s+/).length).toString());
		}

		self.checkAndCancelTimeout = function () {
			if (self.timeoutId != null) {
				//console.log("Timeout " + self.timeoutId + " cancelled");
				clearTimeout(self.timeoutId);
				self.timeoutId = null;
			}
		}

		self.speech_timedout = function() {
			//console.log("Speech cancelled: Timeout " + self.timeoutId + " ended");
			self.cancel();
			//if (!self.iOS) //On iOS, cancel calls msg.onend
			self.speech_onend();

		}

		self.speech_onend = function () {
			self.checkAndCancelTimeout();

			//Avoid this being automatically called just after calling speechSynthesis.cancel
			if (self.cancelled === true) {
				self.cancelled = false;
				return;
			}

			//console.log("on end fired");
			if (self.msgparameters != null && self.msgparameters.onend != null && self.msgparameters.onendcalled!=true) {
				//console.log("Speech on end called  -" + self.msgtext);
				self.msgparameters.onendcalled=true;
				self.msgparameters.onend();

			}

		}

		self.speech_onstart = function () {
			//if (!self.iOS)
			//console.log("Speech start");
			if (self.iOS)
				self.startTimeout(self.msgtext,self.speech_timedout);

			self.msgparameters.onendcalled=false;
			if (self.msgparameters != null && self.msgparameters.onstart != null) {
				self.msgparameters.onstart();
			}

		}



		self.fallback_startPart = function () {

			if (self.fallback_part_index == 0) {
				self.speech_onstart();
			}

			self.fallback_audio = self.fallback_parts[self.fallback_part_index];

			if (self.fallback_audio == null) {

				//Fallback audio is not working. Just wait for the timeout event
				console.log("RV: Fallback Audio is not available");

			} else {

				self.fallback_audio.play();
				self.fallback_audio.addEventListener('ended', self.fallback_finishPart);
			}
		}

		self.fallback_finishPart = function (e) {

			self.checkAndCancelTimeout();

			if (self.fallback_part_index < self.fallback_parts.length - 1) {
				//console.log('chunk ended');
				self.fallback_part_index++;
				self.fallback_startPart();

			} else {
				//console.log('msg ended');
				self.speech_onend();

			}

		}


		self.cancel = function () {

			self.checkAndCancelTimeout();

			if (fallbackMode){
				if (self.fallback_audio!=null)
					self.fallback_audio.pause();
			}else{
				self.cancelled = true;
				speechSynthesis.cancel();

			}
		}


		self.voiceSupport = function () {

			return ('speechSynthesis' in window);

		}

		self.OnFinishedPlaying = function (event) {
			//console.log("OnFinishedPlaying");
			if (self.msgparameters != null) {
				if (self.msgparameters.onend != null)
					self.msgparameters.onend();
			}

		}

		//Set default voice to use when no voice name is supplied to speak()
		self.setDefaultVoice = function (voicename) {

			var vr = getResponsiveVoice(voicename);

			if (vr != null) {
				self.default_vr = vr;
			}

		}

		//Map responsivevoices to system voices
		function mapRVs() {

			for (var i = 0; i < responsivevoices.length; i++) {

				var rv = responsivevoices[i];

				for (var j = 0; j < rv.voiceIDs.length; j++) {

					var vcoll = voicecollection[rv.voiceIDs[j]];

					if (vcoll.fallbackvoice != true) {		// vcoll.fallbackvoice would be null instead of false

						// Look on system voices
						var v = getSystemVoice(vcoll.name);
						if (v != null) {
							rv.mappedProfile = {
								systemvoice: v,
								collectionvoice: vcoll
							};
							//console.log("Mapped " + rv.name + " to " + v.name);
							break;
						}

					} else {

						//Pick the fallback voice
						rv.mappedProfile = {
							systemvoice: {},
							collectionvoice: vcoll
						};
						//console.log("Mapped " + rv.name + " to " + vcoll.lang + " fallback voice");
						break;

					}
				}
			}


		}


		//Look for the voice in the system that matches the one in our collection
		function getMatchedVoice(rv) {

			for (var i = 0; i < rv.voiceIDs.length; i++) {
				var v = getSystemVoice(voicecollection[rv.voiceIDs[i]].name);
				if (v != null)
					return v;
			}

			return null;

		}

		function getSystemVoice(name) {

			if (typeof systemvoices === 'undefined')
				return null;

			for (var i = 0; i < systemvoices.length; i++) {
				if (systemvoices[i].name == name)
					return systemvoices[i];
			}

			return null;

		}

		function getResponsiveVoice(name) {

			for (var i = 0; i < responsivevoices.length; i++) {
				if (responsivevoices[i].name == name) {
					return responsivevoices[i];
				}
			}

			return null;

		}

	}
	var responsiveVoice = new ResponsiveVoice();
}