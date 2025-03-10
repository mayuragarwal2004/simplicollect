import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const OrganisationSelection = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="flex items-center justify-center bg-pink-200">
      {step === 1 && (
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px]">
          <h2 className="text-2xl font-bold mb-6">Choose an Organisation</h2>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="px-4 py-2 bg-gray-400 text-black rounded-lg flex items-center">
              Choose from the below dropdown <ChevronDownIcon className="ml-2" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white shadow-md rounded-md w-48 mt-2 p-2">
              <DropdownMenu.Item className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded">Organisation 1</DropdownMenu.Item>
              <DropdownMenu.Item className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded">Organisation 2</DropdownMenu.Item>
              <DropdownMenu.Item className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded">Organisation 3</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <div className="flex justify-between mt-6">
            <button className="bg-gray-400 text-black px-6 py-2 rounded-lg">&lt; Cancel</button>
            <button className="bg-gray-400 text-black px-6 py-2 rounded-lg" onClick={() => setStep(2)}>Next &gt;</button>
          </div>
        </div>
      )}

      {/* {step === 2 && (
        <div className="p-6 bg-white rounded-2xl shadow-lg w-[700px]">
          <h2 className="text-3xl font-bold mb-6 text-center">Enter chapter’s basic details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Chapter Name</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-400 text-black rounded-lg mt-1" placeholder="Enter the name" />
            </div>
            <div>
              <label className="font-semibold">Chapter Slug</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-400 text-black rounded-lg mt-1" placeholder="Enter the slug" />
            </div>
            <div>
              <label className="font-semibold">City</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-400 text-black rounded-lg mt-1" placeholder="Enter the city" />
            </div>
            <div>
              <label className="font-semibold">State</label>
              <input type="text" className="w-full px-4 py-2 bg-gray-400 text-black rounded-lg mt-1" placeholder="Enter the state" />
            </div>
            <div className="col-span-2">
              <label className="font-semibold">Country</label>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="w-full px-4 py-2 bg-gray-400 text-black rounded-lg mt-1 flex justify-between items-center">
                  Select Country <ChevronDownIcon />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white shadow-md rounded-md w-full mt-2 p-2">
                  <DropdownMenu.Item className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded">India</DropdownMenu.Item>
                  <DropdownMenu.Item className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded">USA</DropdownMenu.Item>
                  <DropdownMenu.Item className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded">UK</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className="bg-gray-400 text-black px-6 py-2 rounded-lg">Next &gt;</button>
          </div>
        </div>
      )} */}
    </div>
  );
};



export default OrganisationSelection;

