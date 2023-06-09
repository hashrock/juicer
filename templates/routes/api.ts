import { Field } from "../../templates/utils/kv.ts";
export function index(name: string, fields: Field[]) {
  const separeted = fields
    .map((i) => i.name)
    .join(", ");

  return `import { Handlers } from "$fresh/server.ts";
import { add${name}, list${name} } from "../../../utils/${name.toLowerCase()}.ts";

export const handler: Handlers = {
  async GET(req, ctx): Promise<Response> {
    const list = await list${name}();
    return new Response(JSON.stringify(list));
  },
  async POST(req, ctx): Promise<Response> {
    const { ${separeted}} = await req.json();
    const id = await add${name}(${separeted});
    return new Response(JSON.stringify({ id }));
  },
};
`;
}

export function single(name: string, fields: Field[]) {
  const separeted = fields
    .map((i) => i.name)
    .join(", ");

  return `import { Handlers } from "$fresh/server.ts";
import { delete${name}, get${name}, update${name} } from "../../../utils/${name.toLowerCase()}.ts";

export const handler: Handlers = {
  async GET(req, ctx): Promise<Response> {
    const list = await get${name}(ctx.params.id);
    return new Response(JSON.stringify(list));
  },
  async PUT(req, ctx): Promise<Response> {
    const { ${separeted} } = await req.json();
    await update${name}(ctx.params.id, ${separeted});
    return new Response(JSON.stringify({ id: ctx.params.id }));
  },
  async DELETE(req, ctx): Promise<Response> {
    const id = await delete${name}(ctx.params.id);
    return new Response(JSON.stringify({ id }));
  },
};
`;
}

export function admin(name: string, example: string) {
  return `import { Head } from "$fresh/runtime.ts";
import AdminPanel from "../../../islands/AdminPanel.tsx";

export default function Home() {
  const example = ${example}

  return (
    <>
      <Head>
        <title>Admin - ${name}</title>
      </Head>
      <div>
        <AdminPanel collection="${name}" example={JSON.stringify(example, null, 2)} />
      </div>
    </>
  );
}`;
}
