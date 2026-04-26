import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const Dropdown = ({ label, options, value, onChange }) => {
    return (
        <div className="w-full">
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </Listbox.Label>

                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-[#0c0d0f] border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <span className="block truncate">{value || 'Select'}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-[#0c0d0f] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
                        {options.map((opt, idx) => (
                            <Listbox.Option
                                key={idx}
                                className={({ active }) =>
                                    `cursor-pointer select-none py-2 pl-10 pr-4 ${active
                                        ? "bg-blue-100 dark:bg-blue-600 text-black dark:text-white"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`
                                }
                                value={opt}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                            {opt}
                                        </span>
                                        {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
};

export default Dropdown;
