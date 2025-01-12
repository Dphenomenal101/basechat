"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, TagInput } from "emblor";
import { Loader2, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Profile } from "@/lib/schema";

interface Props {
  profiles: Profile[];
}

const formSchema = z.object({
  emails: z.array(z.string().email(), { message: "Invalid email address" }).min(1),
});

export default function UserSettings({ profiles: _profiles }: Props) {
  const [profiles, setProfiles] = useState(_profiles);
  const [isLoading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { emails: [] },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const res = await fetch("/api/invites", { method: "POST", body: JSON.stringify(values) });
    if (res.status !== 200) {
      toast.error("Invite failed.  Try again later.");
      return;
    }

    setLoading(false);
    toast.success("Invites sent");
    setTags([]);
    form.reset();

    const newProfiles = values.emails.map((email) => ({ id: "", name: null, email }));
    setProfiles([...profiles, ...newProfiles]);
  }

  const handleSetTags = (tags: Tag[]) => {
    form.clearErrors();
    setTags(tags);

    const emails = (tags as Tag[]).map((t) => t.text);
    form.setValue("emails", emails);
  };

  return (
    <div className="w-full p-4 flex-grow flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full justify-between items-center pt-2">
            <h1 className="font-bold text-[32px]">Users</h1>
            <div className="flex">
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage>Must use valid email addresses</FormMessage>
                    <FormControl>
                      <TagInput
                        placeholder="Email address, comma separated"
                        styleClasses={{
                          input: "shadow-none",
                          inlineTagsContainer: "rounded-lg border border-[#9A57F6] bg-[#F5F5F7] w-[360px] px-1 py-1.5",
                          tag: { body: "pl-3 hover:bg-[#ffffff] bg-[#ffffff]" },
                        }}
                        tags={tags}
                        setTags={(tags) => handleSetTags(tags as Tag[])}
                        addTagsOnBlur
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="flex items-center font-semibold text-white rounded-lg bg-[#D946EF] px-4 py-2.5 ml-3"
                >
                  Invite
                  {isLoading && <Loader2 size={18} className="ml-2 animate-spin" />}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <div className="mt-16">
        <div className="text-[#74747A] mb-1.5">1 user</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[13px] text-[#74747A] pl-0">Name</TableHead>
              <TableHead className="font-semibold text-[13px] text-[#74747A] w-[92px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile, i) => (
              <TableRow key={i}>
                <TableCell className="flex items-center pl-0">
                  {profile.id ? (
                    <>
                      <div className="mr-2">{profile.name}</div>
                      <div className="text-[#74747A]">{profile.email}</div>
                    </>
                  ) : (
                    <>
                      <div className="mr-2">{profile.email}</div>
                      <div className="text-[#74747A] rounded border-[#D7D7D7] border py-1 px-2">Pending</div>
                    </>
                  )}
                </TableCell>
                <TableCell>Owner</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <MoreHorizontal />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => null}>
                        <Trash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
