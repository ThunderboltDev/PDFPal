import withAuth from "@/hoc/with-auth";
import Dashboard from "./dashboard";

export default withAuth(Dashboard, "/dashboard");
