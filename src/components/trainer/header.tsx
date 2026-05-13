import { SidebarTrigger } from "@/components/ui/sidebar";

export default function TrainerHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-10 shrink-0 items-center  px-4">
			<SidebarTrigger className=" lg:hidden max-md:inline-flex" />

			{/* <div className="ms-auto flex items-center gap-2">
				<ModeToggle />
			</div> */}
		</header>
	);
}
