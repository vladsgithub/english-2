<?php
/**
 * @package WordPress
 * @subpackage WPCrest
 * Template Name: Showcase Page
 */
get_header();

the_post();
?>
<div class="wpc-blog-container wpc-container wpc-container-short-margin wpc-group" ng-app="angular">
	<div class="wpc-blog-main new-words" ng-controller="controller">
		<!--<ul>-->
		<!--<li ng-repeat="item in json">-->
		<!--<span>{{item.en}}</span>-->
		<!--</li>-->
		<!--</ul>-->
		<form ng-submit="updateDB()" style="display: none">
			<fieldset class="enter-json">
				<textarea ng-model="inputJSON" placeholder="add english word"></textarea>
				<button ng-click="enterJSON()">Enter JSON</button>
			</fieldset>

			<fieldset>
				<table>
					<thead>
					<tr>
						<th class="category">category</th>
						<th>word</th>
						<th>transcription</th>
						<th>type</th>
						<th>translation</th>
						<th>sound</th>
						<th>picture</th>
						<th>delete</th>
					</tr>
					</thead>

					<tbody ng-repeat="data in newJSON">
					<tr ng-repeat="item in data track by $index">
						<td>
							<input type="text" ng-model="item.ctg" value="{{item.ctg}}" />
						</td>
						<td>
							<input type="text" ng-model="item.word" value="{{item.word}}" title="{{item.word}}" />
						</td>
						<td>
							<input type="text" ng-model="item.trnsc" value="{{item.trnsc}}" />
						</td>
						<td>
							<div class="word-type" onmouseover="addTable(this);" data-ready="false">
								<span>type</span>
								<div class="dom">{{item.dom}}</div>
							</div>
						</td>
						<td>
							<input type="text" ng-model="item.trnsl" value="{{item.trnsl}}" title="{{item.trnsl}}" />
						</td>
						<td>
							<button ng-click="playPhrase(item)">play</button>
							<label>
								<input type="checkbox" ng-model="item.sound" ng-true-value="true" value="{{item.sound}}" />
								<span>Other sound</span>
							</label>
						</td>
						<td>
							<label>
								<input type="checkbox" ng-model="item.pict" value="{{item.pict}}" />
								<span>Picture</span>
							</label>
						</td>
						<td>
							<button ng-click="deleteWord(data, $index)">delete</button>
						</td>
					</tr>
					</tbody>
				</table>
			</fieldset>

			<fieldset>
				<button type="submit">Save</button>
			</fieldset>
		</form>

<!--////////////////////////// begin: temporary solution ///////////////////////-->

        <div>
            <select id="vocabularySelect">
                <option disabled="disabled" selected="selected">Choose the lesson</option>
                <option ng-repeat="item in jsonFileNames">{{item}}</option>
            </select>

            <div class="float-right">
            <?php
                $scanDir = './././json';

                if ( is_user_logged_in() && current_user_can('administrator') ){
                    echo '<span id="primaryNameFile">long-english-</span><input id="newJsonFileName" type="text" placeholder="don\'t use \'-\'" /><button id="addNewJsonFile">Add new JSON file</button>';
                }
                function isNecessaryFile($var) {
                    return (strpos($var, 'long-english-') !== false & substr_count($var, '-') == 2);
                }
                $filesNameArray = scandir($scanDir);
                $filteredArray = array_filter($filesNameArray, "isNecessaryFile");

                echo '<script>var primaryFileName = "long-english-", jsonFileNamesArray = [];';
                foreach($filteredArray as $key => $value){
                    echo 'jsonFileNamesArray.push("'.$value.'");';
                }
                echo '</script>';
            ?>
            </div>
        </div>

		<button ng-click="test=false" ng-class="!test ? 'active' : ''">add sentences</button>
		<button ng-click="test=1" ng-class="test == 1 ? 'active' : ''">perform sound lessons</button>
		<button ng-click="test=2" ng-class="test == 2 ? 'active' : ''">perform writing lessons</button>
        <button ng-click="test=3" ng-class="test == 3 ? 'active' : ''">listen writing lessons</button>

        <?php
        if ( is_user_logged_in() && current_user_can('administrator') ){
            echo '<form class="add-sentences" ng-hide="test" ng-submit="enterSentence()">';
        } else {
            echo '<form class="add-sentences" ng-hide="test" onsubmit="warningAlert()">';
        }
        ?>
			<fieldset>
				<table class="original-table">
					<thead>
					<tr>
						<th class="category">category</th>
						<th class="word">word</th>
						<th>trnsc</th>
						<th>type</th>
						<th class="translation">translation</th>
						<th>sound</th>
						<th>picture</th>
						<th>delete</th>
					</tr>
					</thead>

					<tbody>
					<tr ng-repeat="item in sentences track by $index">
						<td>
							{{$index + 1}}
						</td>
						<td>
							{{item.word}}
						</td>
						<td>
							no
						</td>
						<td>
							type
						</td>
						<td>
							{{item.trnsl}}
						</td>
						<td>
							<button type="button" ng-click="playPhrase(item)">play</button>
						</td>
						<td>
							no
						</td>
						<td>
                            <?php
                            if ( is_user_logged_in() && current_user_can('administrator') ){
                                echo '<button type="button" ng-click="deleteItem($index)">del</button>';
                            } else {
                                echo 'no';
                            }
                            ?>
						</td>
					</tr>
					</tbody>

					<tfoot>
					<tr>
						<td>
							sentences
						</td>
						<td>
							<input id="enSentence" type="text" ng-model="newSnt.word" />
						</td>
						<td>
							no
						</td>
						<td>
							type
						</td>
						<td>
							<input id="ruSentence" type="text" ng-model="newSnt.trnsl" />
						</td>
						<td>
							<button type="button" ng-click="playPhrase(newSnt)">play</button>
						</td>
						<td>
							no
						</td>
						<td>
							<button type="reset">Reset</button>
						</td>
					</tr>
					</tfoot>
				</table>
			</fieldset>

			<fieldset>
				<button type="submit">Enter</button>
			</fieldset>
			<fieldset>
				<br/><br/><br/><br/>
				<button type="button" ng-click="randomSentence()">RANDOM {{random.length}} / {{sentences.length}}</button>
			</fieldset>

			<fieldset style="opacity: 0.5">
				<table>
					<thead>
					<tr>
						<th class="category">category</th>
						<th class="word">word</th>
						<th>trnsc</th>
						<th>type</th>
						<th class="translation">translation</th>
						<th>sound</th>
						<th>picture</th>
						<th>delete</th>
					</tr>
					</thead>

					<tbody>
					<tr ng-repeat="item in random track by $index">
						<td>
							{{$index + 1}}
						</td>
						<td>
							{{item.word}}
						</td>
						<td>
							no
						</td>
						<td>
							type
						</td>
						<td>
							{{item.trnsl}}
						</td>
						<td>
							<button type="button" ng-click="playPhrase(item)">play</button>
							<label>
								<input type="checkbox" ng-model="item.sound" ng-true-value="true" value="{{item.sound}}" />
							</label>
						</td>
						<td>
							no
						</td>
						<td>
							no
						</td>
					</tr>
					</tbody>
				</table>
			</fieldset>
		</form>

		<form class="perform-lessons" ng-show="test == 1" ng-submit="checkSentence()">
			<fieldset>
				<button id="play" type="button" ng-click="playPhrase(sound)" class="play">PLAY {{currentWordNumber + 1}}/{{quantityWords}}</button>
			</fieldset>
			<fieldset>
				<label>English sentence:</label>
				<input id="enSound" type="text" ng-model="sound.en" ng-class="sound.enClass" />
			</fieldset>
			<fieldset ng-show="sound.enClass == 'true'">
				<label>Russian sentence:</label>
				<input id="ruSound" type="text" ng-model="sound.ru" ng-class="sound.ruClass" />
			</fieldset>
			<fieldset>
				<button type="submit">CHECK</button>
			</fieldset>
			<fieldset>
				<br/><br/><br/>
				<button id="newTest" type="button" ng-click="newTest()">NEW TEST</button>
			</fieldset>
		</form>

		<form class="perform-lessons" ng-show="test == 2" ng-submit="checkWriting()">
			<fieldset>
				<h2>{{write.trnsl}}</h2>
				<h3>({{currentWordNumberWrite + 1}}/{{quantityWordsWrite}})</h3>
			</fieldset>
			<fieldset>
				<label>English sentence:</label>
				<input id="enWrite" type="text" ng-model="write.en" ng-class="write.enClass" />
			</fieldset>
			<fieldset>
				<button type="submit">CHECK</button>
			</fieldset>
			<fieldset>
				<br/><br/><br/>
				<button id="newTestWrite" type="button" ng-click="newTestWrite()">NEW TEST</button>
			</fieldset>
		</form>

        <form class="perform-lessons" ng-show="test == 3">
            <fieldset>
                <label><input name="soundLessonsRadio" type="radio" ng-model="radioButton.value" value="repeating" />To repeat sentences</label>
                <label><input name="soundLessonsRadio" type="radio" ng-model="radioButton.value" value="listening" />To listen to sentences</label>
            </fieldset>
            <fieldset>
                <h2>{{ruSoundExpression}}</h2>
                <h3>({{currentExpression + 1}}/{{quantityExpression}})</h3>
            </fieldset>
            <fieldset>
                <h1 id="enSoundExpression">{{enSoundExpression}}</h1>
            </fieldset>
            <fieldset class="inline-block-btn">
                <button ng-click="prevSoundLesson()">PREV</button>
                <button ng-click="playSoundLesson()">PLAY</button>
                <button ng-click="stopSoundLesson()">STOP</button>
                <button ng-click="nextSoundLesson()">NEXT</button>
            </fieldset>
            <fieldset>
                <button ng-click="initSoundLesson()">START</button>
            </fieldset>
        </form>
<!--////////////////////////// end: temporary solution ///////////////////////-->
	</div>

	<!-- <?php the_content(); ?> -->

	<aside class="wpc-blog-sidebar">
		<?php
			if(is_active_sidebar('wpc-sidebar-widgets')) {
				?><ul><?php dynamic_sidebar('wpc-sidebar-widgets'); ?></ul><?php
			}
		?>
	</aside>
</div>
<?php
get_footer();
?>