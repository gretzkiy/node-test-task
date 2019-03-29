const Mustache = require('mustache');
const fs = require('fs');

function render({ id, name, age }) {
    const viewData = {
        user: {
            id,
            name,
            age,
        },
    };

    const baseTemplate = fs.readFileSync('./views/templates/base.mustache', {encoding: 'utf8'});
    const contentTemplate = fs.readFileSync('./views/templates/userEdit.mustache', {encoding: 'utf8'});
    return Mustache.render(baseTemplate, viewData, {content: contentTemplate});
}

module.exports.render = render;