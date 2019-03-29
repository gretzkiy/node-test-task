const Mustache = require('mustache');
const fs = require('fs');

function render(usersData) {
    const viewData = {
        users: usersData,
    };

    const baseTemplate = fs.readFileSync('./views/templates/base.mustache', {encoding: 'utf8'});
    const contentTemplate = fs.readFileSync('./views/templates/usersList.mustache', {encoding: 'utf8'});
    return Mustache.render(baseTemplate, viewData, {content: contentTemplate});
}

module.exports.render = render;