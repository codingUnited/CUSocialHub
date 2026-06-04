import { redirect } from "next/navigation";

export default function Redirect() {
    redirect("/polls");
}

// export default function TemplateDiscussion() {
//     return <div>Discussion by id</div>
// }