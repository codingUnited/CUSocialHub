import { redirect } from "next/navigation";

export default function Redirect() {
    redirect("/polls");
}

// export default function Discussions() {
//     return <div>Discussions Page</div>
// }