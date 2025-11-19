import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchInput } from "../ui/input";
import type { MeasurementItem } from "./schema";

export default function MeasurementsList({ list, setActiveMeasurement, activeMeasurement }: { list: MeasurementItem[], setActiveMeasurement: (measurement: MeasurementItem) => void, activeMeasurement: MeasurementItem }) {
  const [search, setSearch] = useState("");

  return <>
    <div className="hidden md:block space-y-4 w-full md:w-[250px] border p-4 rounded-md">
      <DesktopList list={list} setActiveMeasurement={setActiveMeasurement} activeMeasurement={activeMeasurement} search={search} setSearch={setSearch} />
    </div>
    <div className="block md:hidden">
      <MobileList list={list} setActiveMeasurement={setActiveMeasurement} activeMeasurement={activeMeasurement} search={search} setSearch={setSearch} />
    </div>
  </>

}
function MobileList({ list, setActiveMeasurement, activeMeasurement, search, setSearch }: { list: MeasurementItem[], setActiveMeasurement: (measurement: MeasurementItem) => void, activeMeasurement: MeasurementItem, search: string, setSearch: (search: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">Selecionar medida</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Selecionar medida</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto space-y-2 px-4">
          <DesktopList
            list={list}
            setActiveMeasurement={(measurement) => {
              setActiveMeasurement(measurement)
              setOpen(false)
            }}
            activeMeasurement={activeMeasurement}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DesktopList({ list, setActiveMeasurement, activeMeasurement, search, setSearch }: { list: MeasurementItem[], setActiveMeasurement: (measurement: MeasurementItem) => void, activeMeasurement: MeasurementItem, search: string, setSearch: (search: string) => void }) {
  return <>

    <SearchInput placeholder="Pesquisar medida..." value={search} onChange={(e) => setSearch(e.target.value)} />

    <div className="flex flex-col gap-2">
      {list.filter((measurement) => measurement.text.toLowerCase().includes(search.toLowerCase())).map((measurement) => (
        <Button key={measurement.value}
          className={cn("w-full justify-start", activeMeasurement.value === measurement.value && "bg-muted")}
          variant="ghost"
          onClick={() => setActiveMeasurement(measurement)}
          onKeyDown={(e) => e.key === "Enter" && setActiveMeasurement(measurement)}>
          {measurement.text}
        </Button>
      ))}
    </div>
  </>
}

