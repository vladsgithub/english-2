var app = angular.module("angular", []);

app.controller("controller", [ "$scope", "$http", function($scope, $http) {
//    $http.post("/json/words.json").success(function(data){
//        $scope.json = data;
//    }).error(function(data){
//        $scope.json = [];
//    });
	$scope.dom = function(dom) {
		var s = '<a>link</a>';
		var htmlObject = document.createElement('div');
		htmlObject.innerHTML = s;
		var ss = angular.element('<a>link</a>');
		document.getElementById('p1').html(ss);
		//return ss;
	};

	$scope.playPhrase = function(item) {
		console.log("item=",item);
		if (item && !item.sound) {
			responsiveVoice.speak(item.word, 'UK English Male');
			responsiveVoice.speak(item.word, 'UK English Female');
		}
	};

	$scope.deleteWord = function(arr, i) {
		if (confirm("Are you sure?")) arr.splice(i, 1);
	};

	$scope.enterJSON = function() {
		$scope.newJSON = JSON.parse($scope.inputJSON);
	};

    $scope.updateDB = function() {

        return false;
		//$scope.json.push({
		//    en: $scope.enWords
		//});
		//$scope.enWords = '';

        var date = +new Date();
        $http.post("/json/write.php?date=" + date, $scope.json).success(function(data){
            console.log("data=", data);
        }).error(function(data){
            console.log("Error: " + data);
            alert("Error: " + data);
        });
    };

////////////////////////// begin: temporary solution ///////////////////////
	//var jsonFileName = 'sentences';
	var jsonFileName = 'long-english-01';
	document.getElementsByClassName('wpc-description')[0].innerHTML = '=====================CURRENT FILE - <b>' + jsonFileName + '</b>=====================';

	$http.post("/json/" + jsonFileName + ".json").success(function(data){
		$scope.sentences = data;
	}).error(function(data){
		$scope.sentences = [];
	});

	$http.post("/json/" + jsonFileName + "-random.json").success(function(data){
		$scope.random = data;
		initSentence();
		initSentenceWrite();
	}).error(function(data){
		$scope.random = [];
	});

	$scope.enterSentence = function() {
		$scope.newSnt.word = $scope.newSnt.word.replace(/\s+/g," ").replace(/(^\s+|\s+$)/g,'');
		$scope.newSnt.trnsl = $scope.newSnt.trnsl.replace(/\s+/g," ").replace(/(^\s+|\s+$)/g,'');

		if ($scope.newSnt && $scope.newSnt.word != "") {
			$scope.sentences.push($scope.newSnt);
			$scope.newSnt = '';

			var date = +new Date();
			$http.post("/json/write.php?date=" + date + "&jsonFileName=" + jsonFileName, $scope.sentences).success(function(data){
				console.log("data=", data);
			}).error(function(data){
				console.log("Error: " + data);
				alert("Error: " + data);
			});
		}

		document.getElementById('enSentence').focus();
	};

	$scope.randomSentence = function() {
		$scope.random = $scope.sentences.slice(0);
		$scope.random.shuffle();

		var date = +new Date();
		$http.post("/json/write-random.php?date=" + date + "&jsonFileName=" + jsonFileName, $scope.random).success(function(data){
			console.log("random data=", data);
		}).error(function(data){
			console.log("random Error: " + data);
			alert("Error: " + data);
		});
	};

	$scope.checkSentence = function() {
		var allright = 0;
		if ($scope.sound.ru) $scope.sound.ru = $scope.sound.ru.replace(/\s+/g," ").replace(/(^\s+|\s+$)/g,'');
		if ($scope.sound.en) $scope.sound.en = $scope.sound.en.replace(/\s+/g," ").replace(/(^\s+|\s+$)/g,'');

		//if ($scope.sound.ru) {
		//	if ($scope.sound.ru.toLowerCase() == $scope.sound.trnsl.toLowerCase()) {
		//		allright++;
		//		$scope.sound.ruClass = "true";
		//		document.getElementById("ruSound").value = $scope.sound.trnsl;
		//	} else {
		//		document.getElementById("ruSound").value = $scope.sound.trnsl.substring(0, compare($scope.sound.trnsl, $scope.sound.ru));
		//		$scope.sound.ru = document.getElementById("ruSound").value;
		//		$scope.sound.ruClass = "false";
		//		document.getElementById("ruSound").focus();
		//	}
		//} else {
		//	$scope.sound.ruClass = "false";
		//	document.getElementById("ruSound").focus();
		//}
		document.getElementById("ruSound").value = $scope.sound.trnsl;

		if ($scope.sound.en) {
			if ($scope.sound.en.toLowerCase() == $scope.sound.word.toLowerCase()) {
				allright++;
				$scope.sound.enClass = "true";
				document.getElementById("enSound").value = $scope.sound.word;
			} else {
				document.getElementById("enSound").value = $scope.sound.word.substring(0, compare($scope.sound.word, $scope.sound.en));
				$scope.sound.en = document.getElementById("enSound").value;
				$scope.sound.enClass = "false";
				document.getElementById("enSound").focus();
			}
		} else {
			$scope.sound.enClass = "false";
			document.getElementById("enSound").focus();
		}

		if (allright == 1) {
			// next test
			var nextLesson = function() {
				$scope.playPhrase($scope.sound);
				alert('Ok!!!');
				initSentence(1);
			};
			setTimeout(nextLesson, 10);
		} else {
			var play = function() {
				$scope.playPhrase($scope.sound);
			};
			setTimeout(play, 1000);
		}
	};

	$scope.newTest = function() {
		localStorage['lesson'] = $scope.sentences.length;
		initSentence();
		$scope.playPhrase($scope.sound);
	};

	$scope.checkWriting = function() {
		$scope.write.en = $scope.write.en.replace(/\s+/g," ").replace(/(^\s+|\s+$)/g,'');
		if ($scope.write.en.toLowerCase() == $scope.write.word.toLowerCase()) {
			$scope.write.enClass = "true";
			document.getElementById("enWrite").value = $scope.write.word;

			var nextLesson = function() {
				$scope.playPhrase($scope.write);
				alert('It is right!!!');
				initSentenceWrite(1);
			};
			setTimeout(nextLesson, 10);
		} else {
			document.getElementById("enWrite").value = $scope.write.word.substring(0, compare($scope.write.word, $scope.write.en));
			$scope.write.en = document.getElementById("enWrite").value;
			$scope.write.enClass = "false";
			document.getElementById("enWrite").focus();
		}
	};

	$scope.newTestWrite = function() {
		localStorage['lessonWrite'] = $scope.sentences.length;
		initSentenceWrite();
	};

	function initSentence(next) {
		next = next || 0;
		$scope.quantityWords = $scope.random.length;
		localStorage['lesson'] = localStorage['lesson'] || $scope.quantityWords;
		if (localStorage['lesson'] > $scope.quantityWords) localStorage['lesson'] = $scope.quantityWords;
		$scope.currentWordNumber = localStorage['lesson'] - 1 - next;
		if ($scope.currentWordNumber >= 0) {
			$scope.sound = {};
			$scope.sound.word = $scope.random[$scope.currentWordNumber].word;
			$scope.sound.trnsl = $scope.random[$scope.currentWordNumber].trnsl;
			localStorage['lesson'] -= next;
			if (next) {
				document.getElementById("play").click();
				document.getElementById("enSound").focus();
			}
		} else {
			if ($scope.quantityWords) {
				localStorage['lesson'] = $scope.quantityWords;
				alert('Start from the beginning!!!');
				document.getElementById("newTest").click();
			}
		}
	}

	function initSentenceWrite(next) {
		next = next || 0;
		$scope.quantityWordsWrite = $scope.random.length;
		localStorage['lessonWrite'] = localStorage['lessonWrite'] || $scope.quantityWordsWrite;
		if (localStorage['lessonWrite'] > $scope.quantityWordsWrite) localStorage['lessonWrite'] = $scope.quantityWordsWrite;
		$scope.currentWordNumberWrite = localStorage['lessonWrite'] - 1 - next;
		if ($scope.currentWordNumberWrite >= 0) {
			$scope.write = {};
			$scope.write.word = $scope.random[$scope.currentWordNumberWrite].word;
			$scope.write.trnsl = $scope.random[$scope.currentWordNumberWrite].trnsl;
			localStorage['lessonWrite'] -= next;
			if (next) {
				$scope.$apply();
				document.getElementById('enWrite').focus();
			}
		} else {
			if ($scope.quantityWordsWrite) {
				localStorage['lessonWrite'] = $scope.quantityWordsWrite;
				alert('Start from the beginning!!!');
				document.getElementById("newTestWrite").click();
			}
		}
	}

	function compare(main, word) {
		main = main.toLowerCase();
		word = word.toLowerCase();
		var i;
		for (i = 0; i < main.length; i++) {
			if (main[i] != word[i]) break;
		}
		return i + 1;
	}

	/* Array.shuffle( deep ) - перемешать элементы массива случайным образом

	 deep - необязательный аргумент логического типа, указывающий на то,
	 нужно ли рекурсивно обрабатывать вложенные массивы;
	 по умолчанию false (не обрабатывать)
	 */
	Array.prototype.shuffle = function(b)	{
		var i = this.length, j, t;
		while (i) {
			j = Math.floor( ( i-- ) * Math.random() );
			t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
			this[i] = this[j];
			this[j] = t;
		}

		return this;
	};
////////////////////////// end: temporary solution ///////////////////////
}]);

function addTable(elm) {
	var div, table;
	if (elm.getAttribute('data-ready') == 'false') {
		div = elm.getElementsByClassName('dom')[0];
		table = div.innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;nbsp;/g,' ');
		div.innerHTML = table;
		elm.setAttribute('data-ready', true);
	}
}

/* Use this as a bookmark in your browser's panel for www.wordreference.com

javascript:
(function(){
	var div, iframe, form, input, submit, textarea;
	var href = "http://www.wordreference.com/enru/";

	if(!document.getElementById("div")){
		div = document.createElement("div");
		div.id = "div";
		div.style.position = "absolute";
		div.style.width = "100%";
		div.style.height = "100%";
		div.style.top = 0;
		div.style.background = "#F1F1F1";
		div.style.overflow = "auto";

		iframe = document.createElement("iframe");
		iframe.id = "iframe";
		iframe.src = href;
		iframe.style.width = "99%";
		iframe.style.height = "100%";

		form = document.createElement("form");
		form.id = "form";
		form.style.padding = "5px";
		form.onsubmit = function(){
			var iframeDoc, article, table, arr, wordArr = [], dataArr = [], word, trnsc, nextWord = 0,
				words = document.getElementById("input").value.toLowerCase().split(/\W{1,}/);
			var updateTable = function(arr, i) {
				var table = document.createElement("table");
				var addTR = function(i) {
					table.appendChild(arr[i].cloneNode(true));
					if (arr[i + 1] && !arr[i + 1].hasAttribute("id")) {
						addTR(i + 1);
					}
					return table;
				};
				return addTR(i);
			};

			document.getElementById("textarea").value = "";
			dataArr[0] = [{
				ctg: "sentence",
				word: document.getElementById("input").value,
				trnsc: "",
				trnsl: "",
				dom: ""
			}];

			document.getElementById("iframe").onload = function() {
				var obj;
				iframeDoc = document.getElementById("iframe").contentWindow.document;
				article = iframeDoc.getElementById("articleWRD");

				if (article.getElementsByTagName("table").length) {
					arr = article.getElementsByTagName("tr");
					word = iframeDoc.getElementById("articleHead").getElementsByClassName("headerWord")[0].textContent;
					trnsc = (iframeDoc.getElementById("pronWR")) ? iframeDoc.getElementById("pronWR").textContent : "";

					for (var i = 0; i < arr.length; i++) {
						if (arr[i].hasAttribute("id")) {
							table = updateTable(arr, i);
							obj = {
								ctg: (arr[i].getElementsByTagName("td")[0].getElementsByTagName("i").length) ? arr[i].getElementsByTagName("i")[0].textContent : "",
								word: (arr[i].getElementsByTagName("strong").length) ? arr[i].getElementsByTagName("strong")[0].textContent : word,
								trnsc: trnsc,
								trnsl: (arr[i].getElementsByClassName("ToWrd")[0].childNodes[0].data) ? arr[i].getElementsByClassName("ToWrd")[0].childNodes[0].data.trim() : "---no-translation---",
								dom: '<table><tbody>' + table.innerHTML + '</tbody></table>'
							};
							wordArr.push(obj);
						} else {
							if (table) table.appendChild(arr[i].cloneNode(true));
						}
					}
				}

				dataArr.push(wordArr);
				++nextWord;

				if (nextWord < words.length) {
					wordArr = [];
					document.getElementById("textarea").value = "Completed " + Math.round(100*nextWord/words.length) + "%";
					iframe.src = href + words[nextWord];
				} else {
					document.getElementById("textarea").value = JSON.stringify(dataArr);
					document.getElementById("textarea").focus();
					document.getElementById("textarea").select();
				}
			};

			for (var i = 0; i < words.length; i++) if (!words[i] || (i > 0 && words.slice(0,i-1).indexOf(words[i])+1)) {words.splice(i,1); i--;}
			iframe.src = href + words[0];

			return false;
		};

		input = document.createElement("input");
		input.id = "input";
		input.type = "text";
		input.style.width = "99%";

		submit = document.createElement("button");
		submit.type = "submit";
		submit.innerHTML = "submit";
		submit.style.marginLeft = "-55px";

		textarea = document.createElement("textarea");
		textarea.id = "textarea";
		textarea.style.width = "98%";
		textarea.style.margin = "5px";

		form.appendChild(input);
		form.appendChild(submit);
		div.appendChild(form);
		div.appendChild(textarea);
		div.appendChild(iframe);

		document.body.style.position = "fixed";
		document.body.style.width = "100%";
		document.body.style.height = "100%";
		document.body.appendChild(div);
	}
})();
	*/