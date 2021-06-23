import ReactDom from 'react-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import App from './App';

function ssr(statsFile: string, ssrStats: string) {
    const extractor = new ChunkExtractor({ statsFile });
    const jsx = extractor.collectChunks(
        <ChunkExtractorManager extractor={extractor}>
            <App />
        </ChunkExtractorManager>,
    );
    // Render your application
    const html = ReactDom.renderToString(jsx);
    // You can now collect your script tags
    const scriptTags = extractor.getScriptTags(); // or extractor.getScriptElements();
    // // You can also collect your "preload/prefetch" links
    const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
    const styleTags = extractor.getStyleTags();
    return {
        html,
        linkTags,
        styleTags,
        scriptTags,
    };
}
export default ssr;
