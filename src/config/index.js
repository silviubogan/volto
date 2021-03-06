/**
 * Config.
 * @module config
 */

import { defaultWidget, widgetMapping } from './Widgets';
import {
  layoutViews,
  contentTypesViews,
  defaultView,
  errorViews,
} from './Views';
import { nonContentRoutes } from './NonContentRoutes';
import ToHTMLRenderers, {
  options as ToHTMLOptions,
} from './RichTextEditor/ToHTML';
import {
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
} from './RichTextEditor/Blocks';
import plugins, { inlineToolbarButtons } from './RichTextEditor/Plugins';
import FromHTMLCustomBlockFn from './RichTextEditor/FromHTML';
import {
  groupBlocksOrder,
  requiredBlocks,
  blocksConfig,
  initialBlocks,
} from './Blocks';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';

export const settings = {
  host,
  port,
  // Internal proxy to bypass CORS *while developing*. Not intended for production use.
  // In production, the proxy is disabled, make sure you specify an apiPath that does
  // not require CORS to work.
  apiPath: process.env.RAZZLE_API_PATH || `http://${host}:${port}/api`, // for Plone
  devProxyToApiPath: 'http://localhost:8080/Plone', // Set it to '' for disabling the proxy
  // apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8000', // for Volto reference
  // apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8081/db/web', // for guillotina
  internalApiPath: process.env.RAZZLE_INTERNAL_API_PATH || undefined,
  websockets: process.env.RAZZLE_WEBSOCKETS || false,
  minimizeNetworkFetch: true,
  // should also include ``types`` here, but it explicitely raises Unauthorized
  // for anonymous in plone.restapi
  contentExpand: ['breadcrumbs', 'actions', 'workflow'],
  nonContentRoutes,
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
  FromHTMLCustomBlockFn,
  richTextEditorInlineToolbarButtons: inlineToolbarButtons,
  richTextEditorPlugins: plugins,
  ToHTMLRenderers,
  ToHTMLOptions,
  imageObjects: ['Image'],
  listingPreviewImageField: 'image',
  customStyleMap: null,
  notSupportedBrowsers: ['ie'],
  defaultPageSize: 25,
  isMultilingual: false,
  supportedLanguages: ['en'],
  defaultLanguage: 'en',
};

export const widgets = {
  ...widgetMapping,
  default: defaultWidget,
};

export const views = {
  layoutViews,
  contentTypesViews,
  defaultView,
  errorViews,
};

export const blocks = {
  requiredBlocks,
  blocksConfig,
  groupBlocksOrder,
  initialBlocks,
};
