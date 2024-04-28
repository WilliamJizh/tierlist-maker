import AddUser from "@/components/test/addUser";
import { Card } from "@/components/ui/card";
import { getUsers } from "@/drizzle/actions";

export default async function Page() {
  const users = await getUsers();

  return (
    <div className="grid gap-4">
      {users.map((user) => {
        return (
          <Card key={user.id}>
            <span>{user.name}</span>
            <span>{user.email}</span>
          </Card>
        );
      })}
      <div className="m-auto">
        <AddUser />
      </div>
    </div>
  );
}
