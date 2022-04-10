var style = `style = "text-decoration:none; color : black;"`;

var buttons = {
    update: function(title){
        return `<a href="/update?id=${title}" ${style}>update</a> `;
    },
    create: `<a href="/create" ${style}>create</a> `,
    delete: function(title){
        return `<form action="/delete_process" method ="post">
        <input type="hidden" name="id" value="${title}">
        <input type="submit" value="delete" style="border:0; background-color:white; font-size:20px">
      </form> `;
    }
}

module.exports = buttons;