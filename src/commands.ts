/**
 * The command tree, derived from the buyer MCP registry.
 *
 * ── WHY THE MAP IS EXPLICIT HERE ─────────────────────────────────────
 * `@crossly/cli` derives 287 commands from tool names by rule, because at that
 * size a rule is the only maintainable option and a wrong guess costs one odd
 * verb. There are FIFTEEN buyer tools. A rule over fifteen names would produce
 * `crossly-buyer my get-my-cart` and similar, which is worse in every way than
 * writing `cart get` down once.
 *
 * The guard test asserts this map covers the registry exactly, so adding a tool
 * without a command here fails the build rather than silently shipping a CLI
 * that is missing an endpoint.
 */
import { ALL_TOOLS, type ToolDef } from '@crossly/buyer-mcp/registry';

export interface Command {
  /** Noun the user types first, e.g. `cart`. */
  group: string;
  /** Verb after the noun, e.g. `get`. */
  verb: string;
  /** The MCP tool this runs. */
  tool: string;
}

/**
 * tool name → `<group> <verb>`.
 *
 * Read the right-hand column aloud: "cart get", "cart add", "offers make".
 * That is the whole test for whether a name is right.
 */
const MAP: Record<string, string> = {
  get_my_shopping_profile: 'profile get',
  list_my_purchases: 'orders list',
  get_my_cashback: 'cashback list',

  get_my_cart: 'cart get',
  add_to_my_cart: 'cart add',
  remove_from_my_cart: 'cart remove',
  quote_my_cart: 'cart quote',

  list_my_wishlists: 'wishlists list',
  get_my_wishlist_items: 'wishlists items',
  create_my_wishlist: 'wishlists create',
  add_to_my_wishlist: 'wishlists add',

  report_shopping_activity: 'activity report',
  list_my_shopping_activity: 'activity list',
  get_my_shopping_preferences: 'activity preferences',

  offer_on_listing: 'offers make',
};

export const COMMANDS: Command[] = Object.entries(MAP).map(([tool, path]) => {
  const [group, verb] = path.split(' ');
  return { group: group!, verb: verb!, tool };
});

export const TOOL_BY_COMMAND = new Map<string, ToolDef>(
  COMMANDS.map((c) => {
    const tool = ALL_TOOLS.find((t) => t.name === c.tool);
    if (!tool) throw new Error(`commands.ts maps ${c.tool}, which is not in the registry`);
    return [`${c.group} ${c.verb}`, tool];
  }),
);

/** Groups in a stable order, for help output. */
export function groups(): Map<string, Command[]> {
  const out = new Map<string, Command[]>();
  for (const c of COMMANDS) {
    if (!out.has(c.group)) out.set(c.group, []);
    out.get(c.group)!.push(c);
  }
  return out;
}

export { ALL_TOOLS };
export type { ToolDef };
