import { fetchNewUsers } from "./api";
import { useQuery } from "@tanstack/react-query";

import { LuEye } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NewJoinedMembers() {

  const { data: members } = useQuery({
    queryKey: ["newUsers"],
    queryFn: fetchNewUsers,
  });

  return (
    <div className=" min-w-0 overflow-hidden rounded-2xl border border-c-border bg-c-surface lg:flex-1">

      <div className=" flex items-center justify-between border-b border-c-border px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-c-text-secondary">
            New Joined Members
          </h2>
        </div>
        <Link to="/users">
          <span
            className="rounded-lg px-3 py-2 text-sm font-semibold text-c-primary transition-colors 
             hover:bg-c-primary/10 active:bg-c-primary/20"
          >View All</span>
        </Link>
      </div>

      <div className="divide-y divide-c-border">
        {members?.map((member) => (
          <div
            key={member.id}
            className=" flex items-center gap-3 py-4 px-3 transition-colors hover:bg-c-surface-hover">
            <img
              src={member.avatar}
              alt={member.name}
              className=" h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-c-border" />
            <div className="min-w-0 flex-1">
              <p
                className=" truncate text-lg font-medium text-c-text">
                {member.name}
              </p>
              <p
                className=" mt-0.5 truncate text-xs text-c-text-disabled">
                {member.role}
              </p>
            </div>

            <NavLink tabIndex={-1} to={`/users/${member.id}`}>
              <button
                type="button"
                aria-label={`View ${member.name}`}
                className=" flex h-7 w-10 shrink-0 items-center justify-center rounded-lg border 
              border-c-border text-c-text-muted transition-all duration-200
              hover:border-c-primary/30 hover:bg-c-primary/10 hover:text-c-primary active:bg-c-primary/20">
                <LuEye size={18} />
              </button>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}