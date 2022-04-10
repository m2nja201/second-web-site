var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const path = require('path'); // filteredTitle�� ���� path.parse(title).base�� �� �ȵǴ��� �𸣰ڴ�...

var buttons = require('./lib/button.js');
var template = require('./lib/template.js');
var comment = require('./lib/comment.js').comment;

var app = http.createServer(function(request, response){
    var _url = request.url; // /?id=~ �� ��
    var queryData = url.parse(_url, true).query; // {id : HTML} �� (��ü)
    var title = queryData.id; // HTML
    var pathname = url.parse(_url, true).pathname; // 3000 �ڿ� ������ ?���� ���� (/ or /create or etc)

    var h2Style = `style="color:rgb(195, 104, 71); font-size:30px"`;
    var pStyle = `style="font-size:20px"`;

    if (pathname === '/'){ // home or �ٸ� Ȩ�������� ���� �Ǵ� ��� (ex - HTML, CSS, ...)
        if (title === undefined){ // home
            fs.readdir('./data', function(err, filelist){
                var list = template.LIST(filelist);
                var desc = template.HTML('Welcome', list, buttons.create, `<h2 ${h2Style}>Welcome</h2> <p ${pStyle}>This is my Second Web Site!</p>${comment}`);
                response.writeHead(200); // ���������� ������ �������� 200
                response.end(desc);
            });
        } else {
            fs.readdir('./data', function(err, filelist){
                fs.readFile(`data/${title}`, 'utf8', function(err, desc){
                    var list = template.LIST(filelist);
                    var description = template.HTML(title, list, `${buttons.create}${buttons.update(`${title}`)}${buttons.delete(`${title}`)}`, `<h2 ${h2Style}>${title}</h2> <p ${pStyle}>${desc}</p>`);
                    response.writeHead(200); // ���������� ������ �������� 200
                    response.end(description);
                });
            });
        }
    } else if (pathname === '/create'){
        fs.readdir('./data', function(err, filelist){
            var title = 'myWeb - create';
            var list = template.LIST(filelist);
            var desc = template.HTML(title, list,  '', `
            <form action = "/create_process" method="post"> 
                <p><input type="text" name = "title" placeholder = "title"></p>
                <p><textarea name="description" placeholder = "description"></textarea></p>
                <p><input type="submit" value = "create"></p>
            </form>
            ` )
            response.writeHead(200);
            response.end(desc);
        });
    } else if (pathname === '/create_process'){
        var body = '';
        request.on('data', function(data){ // ���� ����
            body += data;
            // console.log(body); => title=~&description=~���� ����
        });
        request.on('end', function(){ // ���� ������ ���̻� ����
            var post=qs.parse(body); // ��ü�� ������ {title: ~, description: ~}
            // console.log(post);
            var receivedTitle = post.title; // ��ü���� title �κ�
            var receivedDesc = post.description;
            fs.writeFile(`data/${receivedTitle}`, receivedDesc, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${receivedTitle}`});
                response.end('');
            }); // �ش� Location���� �̵�
        });
1   } else if (pathname === '/update'){
        fs.readdir('./data', function(err, filelist){
            fs.readFile(`data/${title}`, 'utf8', function(err, description){
                var list = template.LIST(filelist);
                var desc  = template.HTML(title, list, '', `
                <form action = "/update_process" method="post">
                    <p><input type="hidden" name = "id" value = "${title}"></p> 
                    <p><input type="text" name = "title" placeholder = "title" value=  "${title}"></p>
                    <p><textarea name="description" placeholder = "description">${description}</textarea></p>
                    <p><input type="submit" value = "update"></p>
                </form>
                `);
                response.writeHead(200);
                response.end(desc);
            });
        });
    } else if (pathname === '/update_process'){
        var body = "";
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var receivedID = post.id;
            var receivedTitle = post.title;
            var receivedDesc = post.description;

            fs.rename(`data/${receivedID}`, `data/${receivedTitle}`, function(err){
                fs.writeFile(`data/${receivedTitle}`, receivedDesc, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${receivedTitle}`});
                    response.end();
                });
            });
        });
    } else if (pathname === '/delete_process'){
        var body = "";
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var receivedID = post.id;
            fs.unlink(`data/${receivedID}`, function(err){
                response.writeHead(302, {Location: `/`}); // home���� ���ư���
                response.end();
            });
        })
    } else { // fail
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);