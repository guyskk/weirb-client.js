import * as fs from 'fs';
import * as lodash from 'lodash';
import * as ejs from 'ejs';


const TEMPLATE = `
import {Client, Service} from 'weirb-hrpc-client';

<% for (service of services) { %>
/** <%= service.doc || 'No Doc' %> */
export class <%= service.name %>Service extends Service {

    constructor(client: Client) {
        super('<%= service.name %>', client);
    }
    <% for (method of service.methods) { %>
    /** <%= method.doc || 'No Doc' %> */
    async <%= method.name %>(this: <%= service.name %>Service, params: Object): Promise<[any, any]> {
        return await this.call('<%= method.name %>', params, <%= method.is_http_request %>, <%= method.is_http_response %>);
    }
    <% } %>
};
<% } %>

export enum Error {
    <% for (error of errors) { %>
    /** <%= error.doc || 'No Doc' %> */
    <%= error.name %> = '<%= error.code %>',
    <% } %>
};
`


function generate(metaPath: string, outputPath: string) {
    const serviceMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

    let errors = [];
    let rawErrors = lodash.concat(
        serviceMeta.builtin_errors,
        serviceMeta.service_errors
    );
    for (let err of rawErrors) {
        let name = lodash.replace(err.code, /\./g, '');
        errors.push({
            name: name,
            code: err.code,
            doc: err.doc,
        });
    };

    let result = ejs.render(TEMPLATE, {
        services: serviceMeta.services,
        errors: errors,
    });

    fs.writeFileSync(outputPath, result, 'utf-8');
}

const version = '1.0.0';

export { generate, version };
