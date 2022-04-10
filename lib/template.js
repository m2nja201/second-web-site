module.exports = {
    HTML : function(title, list, button, body){
        return `
        <!doctype html>
        <html>
        <head>
          <title>myWeb - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1 style = "text-align:center;"><a href="/" style = "color: rgba(197, 113, 117, 0.7); font-size:70px; text-decoration:none;">myWEB</a></h1>
          <div align="center" style = "font-size:20px;">${button}</div>
          ${list}
          ${body}
        </body>
        </html>
        `
    },
    LIST : function(filelist){
        var sample = `<ol>`;
        for (var i=0; i<filelist.length; i++){
            sample += `<li><a href = "/?id=${filelist[i]}" style="text-decoration:none; color:black; font-size:15px">${filelist[i]}</a></li>`;
        }
        sample += `</ul>`;
        return sample;
    }
}