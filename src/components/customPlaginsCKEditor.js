import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
// import linkIcon from '@/assets/icons/insert.svg'
import linkIcon from "@/assets/default.svg"
export default class InsertRouterLink extends Plugin{
    init(){
        const editor = this.editor;
        editor.ui.componentFactory.add('addRouterLink',locale => {
            const view = new ButtonView(locale);
            view.set( {
                label: 'Insert vue-router Link',
                icon: linkIcon,
                tooltip: true
            } );
            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                const linkURL = prompt( 'внутрення сслыка сайта URL');
                // console.log("linkURL",  linkURL)
                // console.log("editor.model",editor.model)
                editor.model.change( writer => {
                    // console.log("writer",  writer)
                    // console.log("ModelElement", ModelElement)
                    const routerLinkElement = writer.createElement( 'router-link', {
                        to: linkURL,
                        class: 'artikle-link'
                    });
                    // Insert the image in the current selection location.
                    editor.model.insertContent( routerLinkElement, editor.model.document.selection );
                    editor.document.enqueueChanges( () => {
                    const routerLinkElement = new ModelElement( 'router-link', {
                        to: linkURL,
                        class: 'artikle-link'
                    } );
                    console.log("routerLinkElement",routerLinkElement)
                    editor.data.insertContent( routerLinkElement, editor.document.selection );
                } );
                } );
            } );
            return view;
        });
    }
}
