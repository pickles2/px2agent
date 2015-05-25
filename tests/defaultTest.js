var assert = require('assert');
var px2agent = require('../libs/px2agent');
var path = require('path');
var fs = require('fs');
var phpjs = require('phpjs');

function getProject( testDataName ){
	return require('../libs/px2agent').createProject( path.resolve(__dirname,'./testData/'+testDataName+'/.px_execute.php') );
}

describe('Pickles2 API から値を取得するテスト', function() {
	var pj = getProject('htdocs1');

	it("バージョン番号を取得するテスト", function(done) {
		pj.get_version(function(version){
			// version = '2.0.111-beta299-nb';
			// console.log(typeof(version));
			// console.log(version);
			var matched = version.match(new RegExp('^([0-9]+\\.[0-9]+\\.[0-9]+)(\\-(?:alpha|beta)[0-9]+)?(\\-nb)?$'));
			assert.notEqual(matched, null);
			done();
		});
	});

	it("configを取得するテスト", function(done) {
		pj.get_config(function(conf){
			// console.log(conf);
			assert.equal(conf.name, 'px2agent test htdocs1');
			assert.equal(conf.allow_pxcommands, 1);
			assert.equal(typeof(conf.funcs), typeof({}));
			assert.equal(typeof(conf.funcs.processor.html), typeof({}));
			done();
		});
	});

	it("サイトマップを取得するテスト", function(done) {
		pj.get_sitemap(function(sitemap){
			// console.log(sitemap);
			// assert.equal(conf.name, 'px2agent test htdocs1');
			// assert.equal(conf.allow_pxcommands, 1);
			// assert.equal(typeof(conf.funcs), typeof({}));
			// assert.equal(typeof(conf.funcs.processor.html), typeof({}));
			done();
		});
	});
});


describe('Pickles2 からHTMLページを取得するテスト', function() {
	var pj = getProject('htdocs1');

	it("Mozilla/5.0 としてトップページを取得する", function(done) {
		pj.query(
			'/' ,
			{
				"userAgent": "Mozilla/5.0",
				"complete": function(html, code){
					// console.log(html);
					// var matched = version.match(new RegExp('^([0-9]+\\.[0-9]+\\.[0-9]+)(\\-(?:alpha|beta)[0-9]+)?(\\-nb)?$'));
					assert.equal(typeof(html), typeof(''));
					done();
				}
			}
		);
	});

	it("Mozilla/5.0 としてトップページをJSON形式で取得する", function(done) {
		pj.query(
			'/' ,
			{
				"userAgent": "Mozilla/5.0",
				"output": "json" ,
				"complete": function(data, code){
					data = JSON.parse(data);
					// console.log(data);
					assert.equal(data.status, 200);
					assert.equal(data.message, 'OK');
					done();
				}
			}
		);
	});

});



describe('ページ情報を取得するテスト', function() {
	var pj = getProject('htdocs1');

	it("path '/' のページ情報を取得する", function(done) {
		pj.get_page_info( '/', function( page_info ){
			// console.log(page_info);
			assert.equal( typeof(page_info), typeof({}) );
			assert.equal( page_info.id, '' );
			assert.equal( page_info.title, 'HOME' );
			assert.equal( page_info.path, '/index.html' );
			done();
		} );
	});

	it("id '' のページ情報を取得する", function(done) {
		pj.get_page_info( '', function( page_info ){
			// console.log(page_info);
			assert.equal( typeof(page_info), typeof({}) );
			assert.equal( page_info.id, '' );
			assert.equal( page_info.title, 'HOME' );
			assert.equal( page_info.path, '/index.html' );
			done();
		} );
	});

});


describe('親ページのページIDを取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/' のページ情報を取得する", function(done) {
		pj.get_parent( '/sample_pages/', function( parent ){
			// console.log(parent);
			assert.equal( parent, '' );
			done();
		} );
	});

	it("path '/' の親ページを取得する", function(done) {
		pj.get_parent( '/', function( parent ){
			assert.equal( parent, false );
			done();
		} );
	});

});




describe('子ページのページID一覧を取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/' の子ページ一覧を取得する", function(done) {
		pj.get_children( '/sample_pages/', function( children ){
			// console.log(children);
			assert.equal( typeof(children), typeof([]) );
			assert.equal( children[0], ':auto_page_id.4' );
			assert.equal( children[6], 'sitemapExcel_auto_id_1' );
			assert.equal( children.length, 7 );
			done();
		} );
	});

	it("path '/' の子ページ一覧を取得する", function(done) {
		pj.get_children( '/', function( children ){
			// console.log(children);
			assert.equal( typeof(children), typeof([]) );
			assert.equal( children[0], ':auto_page_id.3' );
			assert.equal( children[3], ':auto_page_id.21' );
			assert.equal( children.length, 4 );
			done();
		} );
	});

});


describe('兄弟ページのページID一覧を取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/' の兄弟ページ一覧を取得する", function(done) {
		pj.get_bros( '/sample_pages/', function( bros ){
			// console.log(bros);
			assert.equal( typeof(bros), typeof([]) );
			assert.equal( bros[0], ':auto_page_id.3' );
			assert.equal( bros[3], ':auto_page_id.21' );
			assert.equal( bros.length, 4 );
			done();
		} );
	});

	it("path '/' の兄弟ページ一覧を取得する", function(done) {
		pj.get_bros( '/', function( bros ){
			// console.log(bros);
			assert.equal( typeof(bros), typeof([]) );
			assert.equal( bros[0], '' );
			assert.equal( bros.length, 1 );
			done();
		} );
	});

});

	// /**
	//  * PX=api.get.bros_next
	//  */
	// this.get_bros_next = function(path, cb){
	// 	return apiGet('api.get.bros_next', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.bros_prev
	//  */
	// this.get_bros_prev = function(path, cb){
	// 	return apiGet('api.get.bros_prev', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.next
	//  */
	// this.get_next = function(path, cb){
	// 	return apiGet('api.get.next', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.prev
	//  */
	// this.get_prev = function(path, cb){
	// 	return apiGet('api.get.prev', path, {}, cb);
	// }

describe('パンくず上のページ一覧を取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/page1/2.html' の兄弟ページ一覧を取得する", function(done) {
		pj.get_breadcrumb_array( '/sample_pages/page1/2.html', function( breadcrumb ){
			// ※このAPIが返す値には、自分自身は含まれない。
			// console.log(breadcrumb);
			assert.equal( typeof(breadcrumb), typeof([]) );
			assert.equal( breadcrumb[0], '' );
			assert.equal( breadcrumb[1], ':auto_page_id.3' );
			assert.equal( breadcrumb.length, 2 );
			done();
		} );
	});

});


describe('ダイナミックパス情報を取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/page1/2.html' のダイナミックパス情報を取得する", function(done) {
		pj.get_dynamic_path_info( '/sample_pages/page1/2.html', function( value ){
			// console.log(value);
			assert.equal( value, false );
			done();
		} );
	});

	it("path '/sample_pages/page1/4/{*}' のダイナミックパス情報を取得する", function(done) {
		pj.get_dynamic_path_info( '/sample_pages/page1/4/{*}', function( value ){
			// console.log(value);
			assert.equal( typeof(value), typeof({}) );
			assert.equal( value.path, '/sample_pages/page1/4/' );
			assert.equal( value.path_original, '/sample_pages/page1/4/{*}' );
			assert.equal( value.id, ':auto_page_id.13' );
			done();
		} );
	});

	it("path '/sample_pages/page1/4/param/value/index.html' のダイナミックパス情報を取得する", function(done) {
		pj.get_dynamic_path_info( '/sample_pages/page1/4/param/value/index.html', function( value ){
			// console.log(value);
			assert.equal( typeof(value), typeof({}) );
			assert.equal( value.path, '/sample_pages/page1/4/' );
			assert.equal( value.path_original, '/sample_pages/page1/4/{*}' );
			assert.equal( value.id, ':auto_page_id.13' );
			done();
		} );
	});

});



describe('ホームディレクトリのパスを取得する', function() {
	var pj = getProject('htdocs1');

	it("ホームディレクトリのパスを取得する", function(done) {
		pj.get_path_homedir( function( path_home_dir ){
			// console.log(path_home_dir);
			assert.equal( typeof(path_home_dir), typeof('') );
			assert.equal( fs.realpathSync(path_home_dir), fs.realpathSync(__dirname+'/testData/htdocs1/px-files/') );
			done();
		} );
	});
});


describe('コンテンツルートディレクトリのパスを取得する', function() {
	var pj = getProject('htdocs1');

	it("コンテンツルートディレクトリのパスを取得する", function(done) {
		pj.get_path_controot( function( path_controot ){
			// console.log(path_controot);
			assert.equal( typeof(path_controot), typeof('') );
			assert.equal( path_controot, '/' );
			done();
		} );
	});
});

describe('ドキュメントルートディレクトリのパスを取得する', function() {
	var pj = getProject('htdocs1');

	it("ドキュメントルートディレクトリのパスを取得する", function(done) {
		pj.get_path_docroot( function( path_docroot ){
			// console.log(path_docroot);
			assert.equal( typeof(path_docroot), typeof('') );
			assert.equal( fs.realpathSync(path_docroot), fs.realpathSync(__dirname+'/testData/htdocs1/') );
			done();
		} );
	});
});

describe('コンテンツのパスを取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/' のコンテンツのパスを取得する", function(done) {
		pj.get_path_content( '/', function( path_content ){
			// console.log(path_docroot);
			assert.equal( path_content, '/index.html' );
			done();
		} );
	});

	it("path '/sample_pages/page1/3.html' のコンテンツのパスを取得する", function(done) {
		pj.get_path_content( '/sample_pages/page1/3.html', function( path_content ){
			// console.log(path_content);
			assert.equal( path_content, '/sample_pages/page1/3.html.md' );
			done();
		} );
	});
});

describe('コンテンツのリソースディレクトリのパスを取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/' のコンテンツのリソースディレクトリのパスを取得する", function(done) {
		pj.path_files( '/', '/images/test.png', function( path_content ){
			// console.log(path_docroot);
			assert.equal( path_content, '/index_files/images/test.png' );
			done();
		} );
	});

	it("path '/' のコンテンツのリソースディレクトリのパスを取得する(第二引数をnullで指定)", function(done) {
		pj.path_files( '/', null, function( path_content ){
			// console.log(path_docroot);
			assert.equal( path_content, '/index_files/' );
			done();
		} );
	});

	it("path '/sample_pages/page1/3.html' のコンテンツのリソースディレクトリのパスを取得する", function(done) {
		pj.path_files( '/sample_pages/page1/3.html', '', function( path_content ){
			// console.log(path_content);
			assert.equal( path_content, '/sample_pages/page1/3_files/' );
			done();
		} );
	});
});

describe('コンテンツのリソースディレクトリの絶対パスを取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/' のコンテンツのリソースディレクトリの絶対パスを取得する", function(done) {
		pj.realpath_files( '/', '/images/test.png', function( path_content ){
			// console.log(path_docroot);
			assert.equal( path.resolve(path_content), path.resolve(__dirname+'/testData/htdocs1/'+'/index_files/images/test.png') );
			done();
		} );
	});

	it("path '/' のコンテンツのリソースディレクトリの絶対パスを取得する(第二引数をnullで指定)", function(done) {
		pj.realpath_files( '/', null, function( path_content ){
			// console.log(path_docroot);
			assert.equal( path.resolve(path_content), path.resolve(__dirname+'/testData/htdocs1/'+'/index_files/') );
			done();
		} );
	});

	it("path '/sample_pages/page1/3.html' のコンテンツのリソースディレクトリの絶対パスを取得する", function(done) {
		pj.realpath_files( '/sample_pages/page1/3.html', '', function( path_content ){
			// console.log(path_content);
			assert.equal( path.resolve(path_content), path.resolve(__dirname+'/testData/htdocs1/'+'/sample_pages/page1/3_files/') );
			done();
		} );
	});
});



describe('コンテンツの cache directory のパスを調べる', function() {
	var pj = getProject('htdocs1');

	it("path '/' の cache directory のパス", function(done) {
		pj.path_files_cache( '/', '/sample.png', function( result ){
			// console.log(result);
			assert.equal( result, '/caches/c/index_files/sample.png' );
			done();
		} );
	});

});


describe('コンテンツの cache directory の絶対パスを調べる', function() {
	var pj = getProject('htdocs1');

	it("path '/' の cache directory の絶対パス", function(done) {
		pj.realpath_files_cache( '/', '/sample.png', function( realpath ){
			// console.log(realpath);
			assert.equal( path.resolve( realpath ), path.resolve( __dirname+'/testData/htdocs1/caches/c/index_files/sample.png' ) );
			done();
		} );
	});

});


describe('コンテンツの private cache directory の絶対パスを調べる', function() {
	var pj = getProject('htdocs1');

	it("path '/' の private cache directory の絶対パス", function(done) {
		pj.realpath_files_private_cache( '/', '/sample.png', function( realpath ){
			// console.log(realpath);
			assert.equal( path.resolve( realpath ), path.resolve( __dirname+'/testData/htdocs1/px-files/_sys/ram/caches/c/index_files/sample.png' ) );
			done();
		} );
	});

});



describe('ドメイン名を取得する', function() {
	var pj = getProject('htdocs1');

	it("ドメイン名を取得する", function(done) {
		pj.get_domain( function( domain ){
			// console.log(domain);
			assert.equal( domain, 'pickles2.pxt.jp' );
			done();
		} );
	});

});

describe('ディレクトリインデックスのテスト', function() {
	var pj = getProject('htdocs1');

	it("ディレクトリインデックスの一覧を取得する", function(done) {
		pj.get_directory_index( function( directory_index ){
			// console.log(directory_index);
			assert.equal( typeof(directory_index), typeof([]) );
			assert.equal( directory_index[0], 'index.html' );
			assert.equal( directory_index.length, 1 );
			done();
		} );
	});

	it("最も優先されるディレクトリインデックスを取得する", function(done) {
		pj.get_directory_index_primary( function( directory_index ){
			// console.log(directory_index);
			assert.equal( directory_index, 'index.html' );
			done();
		} );
	});

});



describe('proc_typeを取得する', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/index.html' のproc_typeを取得", function(done) {
		pj.get_path_proc_type( '/sample_pages/index.html', function( proc_type ){
			// console.log(proc_type);
			assert.equal( proc_type, 'html' );
			done();
		} );
	});

	it("path '/common/styles/common.css' のproc_typeを取得", function(done) {
		pj.get_path_proc_type( '/common/styles/common.css', function( proc_type ){
			// console.log(proc_type);
			assert.equal( proc_type, 'css' );
			done();
		} );
	});

	it("path '/common/images/logo.png' のproc_typeを取得", function(done) {
		pj.get_path_proc_type( '/common/images/logo.png', function( proc_type ){
			// console.log(proc_type);
			assert.equal( proc_type, 'direct' );
			done();
		} );
	});

	it("path '/vendor/autoload.php' のproc_typeを取得", function(done) {
		pj.get_path_proc_type( '/vendor/autoload.php', function( proc_type ){
			// console.log(proc_type);
			assert.equal( proc_type, 'ignore' );
			done();
		} );
	});


});




describe('リンク先を解決するテスト', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/index.html' へのリンク", function(done) {
		pj.href( '/sample_pages/index.html', function( href ){
			// console.log(href);
			assert.equal( typeof(href), typeof('') );
			assert.equal( href, '/sample_pages/' );
			done();
		} );
	});


});


describe('ダイナミックパスの一覧に含まれるかどうか調べる', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/page1/4/{*}' がダイナミックパスかチェック", function(done) {
		pj.is_match_dynamic_path( '/sample_pages/page1/4/{*}', function( result ){
			// console.log(result);
			assert.equal( result, true );
			done();
		} );
	});

	it("path '/sample_pages/page1/4/' がダイナミックパスかチェック", function(done) {
		pj.is_match_dynamic_path( '/sample_pages/page1/4/', function( result ){
			// console.log(result);
			assert.equal( result, true );
			done();
		} );
	});

	it("path '/sample_pages/page1/4/param1/param2.html' がダイナミックパスかチェック", function(done) {
		pj.is_match_dynamic_path( '/sample_pages/page1/4/param1/param2.html', function( result ){
			// console.log(result);
			assert.equal( result, true );
			done();
		} );
	});

	it("path '/sample_pages/' がダイナミックパスかチェック", function(done) {
		pj.is_match_dynamic_path( '/sample_pages/', function( result ){
			// console.log(result);
			assert.equal( result, false );
			done();
		} );
	});

});


describe('パンくずに含まれるかどうか調べる', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/' が path '/sample_pages/page1/2.html' のパンくずに含まれるかチェック", function(done) {
		pj.is_page_in_breadcrumb( '/sample_pages/page1/2.html', '/sample_pages/', function( result ){
			// console.log(result);
			assert.equal( result, true );
			done();
		} );
	});


});


describe('ignore_pathかどうか調べる', function() {
	var pj = getProject('htdocs1');

	it("path '/sample_pages/index.html' をチェック", function(done) {
		pj.is_ignore_path( '/sample_pages/index.html', function( is_ignore ){
			// console.log(is_ignore);
			assert.equal( is_ignore, false );
			done();
		} );
	});

	it("path '/common/styles/common.css' をチェック", function(done) {
		pj.is_ignore_path( '/common/styles/common.css', function( is_ignore ){
			// console.log(is_ignore);
			assert.equal( is_ignore, false );
			done();
		} );
	});

	it("path '/common/images/logo.png' をチェック", function(done) {
		pj.is_ignore_path( '/common/images/logo.png', function( is_ignore ){
			// console.log(is_ignore);
			assert.equal( is_ignore, false );
			done();
		} );
	});

	it("path '/vendor/autoload.php' をチェック", function(done) {
		pj.is_ignore_path( '/vendor/autoload.php', function( is_ignore ){
			// console.log(is_ignore);
			assert.equal( is_ignore, true );
			done();
		} );
	});


});




describe('パブリッシュするテスト', function() {
	var pj = getProject('htdocs1');

	it("パブリッシュする", function(done) {
		this.timeout(20*1000);
		pj.publish({
			"success": function(output){
				// console.log(output);
			},
			"complete": function(output){
				// console.log(output);
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/alert_log.csv'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'), true );

				done();
			}
		});
	});

	it("/common/ ディレクトリのみパブリッシュする", function(done) {
		this.timeout(20*1000);
		pj.publish({
			"path_region": "/common/",
			"success": function(output){
				// console.log(output);
			},
			"complete": function(output){
				// console.log(output);
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/common/styles/contents.css'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'), true );

				done();
			}
		});
	});
// path_region
});



describe('キャッシュを削除するテスト', function() {
	var pj = getProject('htdocs1');

	it("キャッシュを削除する", function(done) {
		pj.clearcache({
			"success": function(output){
				// console.log(output);
			},
			"complete":function(output){
				// console.log(output);
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/alert_log.csv'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/.gitkeep'), true );
				done();
			}
		});
	});

});


