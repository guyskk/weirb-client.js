import * as fs from 'fs';
import * as lodash from 'lodash';
import * as ejs from 'ejs';
var TEMPLATE = "\nimport {Client, Service} from 'weirb-hrpc-client';\n\n<% for (service of services) { %>\n/** <%= service.doc || 'No Doc' %> */\nexport class <%= service.name %>Service extends Service {\n\n    constructor(client: Client) {\n        super('<%= service.name %>', client);\n    }\n    <% for (method of service.methods) { %>\n    /** <%= method.doc || 'No Doc' %> */\n    async <%= method.name %>(this: <%= service.name %>Service, params: Object): Promise<[any, any]> {\n        return await this.call('<%= method.name %>', params, <%= method.is_http_request %>, <%= method.is_http_response %>);\n    }\n    <% } %>\n};\n<% } %>\n\nexport enum Error {\n    <% for (error of errors) { %>\n    /** <%= error.doc || 'No Doc' %> */\n    <%= error.name %> = '<%= error.code %>',\n    <% } %>\n};\n";
function generate(metaPath, outputPath) {
    var serviceMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    var errors = [];
    var rawErrors = lodash.concat(serviceMeta.builtin_errors, serviceMeta.service_errors);
    for (var _i = 0, rawErrors_1 = rawErrors; _i < rawErrors_1.length; _i++) {
        var err = rawErrors_1[_i];
        var name = lodash.replace(err.code, /\./g, '');
        errors.push({
            name: name,
            code: err.code,
            doc: err.doc
        });
    }
    ;
    var result = ejs.render(TEMPLATE, {
        services: serviceMeta.services,
        errors: errors
    });
    fs.writeFileSync(outputPath, result, 'utf-8');
}
var version = '1.0.0';
export { generate, version };
//# sourceMappingURL=generator.js.map