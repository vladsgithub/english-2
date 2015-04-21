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
	<div id="showMessages" class="messages alert">alert</div>
	<div class="wpc-blog-main new-words" ng-controller="controller">
		<!--<ul>-->
		<!--<li ng-repeat="item in json">-->
		<!--<span>{{item.en}}</span>-->
		<!--</li>-->
		<!--</ul>-->
		<form ng-submit="updateDB()">
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