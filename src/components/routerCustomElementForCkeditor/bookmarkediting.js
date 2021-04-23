import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// eslint-disable-next-line no-unused-vars
import {toWidget,toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
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
        schema.register( 'router-text', {
            // Cannot be split or left by the caret.
            // allowWhere: '$text',
            isLimit: true,
            isInline: false,
            allowIn: 'router-link',
            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        } );
        // schema.addChildCheck( ( context, childDefinition ) => {
        //     if ( context.endsWith( 'router-text' ) && childDefinition.name == 'router-link' ) {
        //         return false;
        //     }
        // } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // conversion.attributeToAttribute({
        //     model: {
        //         name: 'router-link',
        //         key: 'to'
        //     },
        //     view: {
        //         key: 'to'
        //     }
        // });
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
                return modelWriter.createElement('router-link', {name, to});
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'router-link',
            view: (modelItem, {writer: viewWriter}) => {
                const to = modelItem.getAttribute('to');
                const aRouter = viewWriter.createContainerElement('router-link', {to, class: 'router-link'});
                viewWriter.setCustomProperty('routerName', true, aRouter);
                return toWidget(aRouter, viewWriter);
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'router-link',
            view: (modelItem, {writer: viewWriter}) => {
                const to = modelItem.getAttribute('to');
                return viewWriter.createAttributeElement('router-link', {to});
            }
        });
        conversion.for( 'upcast' ).elementToElement( {
            model: 'router-text',
            view: {
                name: 'span',
                classes: 'router-text'
            },
            converterPriority: 'high'
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'router-text',
            view: {
                name: 'span',
                classes: 'router-text'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'router-text',
            view: ( modelElement, { writer: viewWriter } ) => {
                const span = viewWriter.createEditableElement( 'span', { class: 'router-text' } );
                // const text = "Link";
                // const innerText = viewWriter.createText(text);
                // viewWriter.insert( viewWriter.createPositionAt( span, 0 ), innerText );
                return toWidgetEditable( span, viewWriter );
            }
        } );
    }
}
