import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// eslint-disable-next-line no-unused-vars
import {toWidget} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import BookmarkCommand from './bookmarkcommand';
import BookmarkDeleteCommand from './bookmarkdeletecommand';

export default class BookmarkEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('router-link', new BookmarkCommand(this.editor));
        this.editor.commands.add('deleteRouterLink', new BookmarkDeleteCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('router-link', {
            allowWhere: '$text',
            isLimit: true,
            isInline: true,
            isObject: true,
            allowAttributes: ['to', 'class']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.attributeToAttribute({
            model: {
                name: 'router-link',
                key: 'to'
            },
            view: {
                key: 'to'
            }
        });

        conversion.for('upcast').elementToElement({
            view: {
                name: 'a',
                attributes: {
                    name: true
                }
            },
            model: (viewElement, { writer: modelWriter }) => {
                const name = viewElement.getAttribute('to');
                return modelWriter.createElement('router-link', {name});
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'router-link',
            view: (modelItem, { writer: viewWriter }) => {
                const to = modelItem.getAttribute('to');

                const aRouter = viewWriter.createContainerElement('span', { to, class: 'router-link' });

                viewWriter.setCustomProperty('routerName', true, aRouter);
                return toWidget(aRouter, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'router-link',
            view: (modelItem, { writer: viewWriter }) => {
                const to = modelItem.getAttribute('to');
                return viewWriter.createAttributeElement('a', {to});
            }
        });
    }
}
