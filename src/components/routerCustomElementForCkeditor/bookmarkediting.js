import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// eslint-disable-next-line no-unused-vars
import {toWidget} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
// import Position from '@ckeditor/ckeditor5-engine/src/model/position';
import BookmarkCommand from './bookmarkcommand';
import BookmarkDeleteCommand from './bookmarkdeletecommand';

export default class BookmarkEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        // this.editor.editing.mapper.on(
        //     'viewToModelPosition',
        //     (evt, data) => {
        //         if (data.viewPosition && data.viewPosition.parent && data.viewPosition.parent._textData === "link") {
        //             const elmRouter= data.mapper.toModelElement(data.viewPosition.parent.parent);
        //             data.modelPosition = new Position(elmRouter, [0]);
        //             evt.stop();
        //         }
        //     }
        // );
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
                name: 'router-link',
                attributes: {
                    to: true,
                    name: true
                }
            },
            model: (viewElement, {writer: modelWriter}) => {
                const to = viewElement.getAttribute('to');
                const name = viewElement.data;
                // console.log("viewElement",viewElement)
                // console.log("name",name)
                return modelWriter.createElement('router-link', {name, to});
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'router-link',
            view: (modelItem, {writer: viewWriter}) => {
                const to = modelItem.getAttribute('to');
                const aRouter = viewWriter.createContainerElement('router-link', {to, class: 'router-link'});
                let txt = viewWriter.createText('link');
                viewWriter.insert(viewWriter.createPositionAt(aRouter, 0), txt)
                viewWriter.setCustomProperty('routerName', true, aRouter);
                return toWidget(aRouter, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'router-link',
            view: (modelItem, {writer: viewWriter}) => {

                const to = modelItem.getAttribute('to');
                // const name = modelItem.data;
                // console.log("modelItem",modelItem)
                // console.log("to",to)
                // console.log("name",name)
                return viewWriter.createAttributeElement('router-link', {to});
            }
        });
    }
}
