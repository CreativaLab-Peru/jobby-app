'use client';

import {Check, Edit, Loader2, X} from 'lucide-react';
import {Input} from "@/components/ui/input";
import {useState} from "react";

interface TitleAndFormProps {
  title: string;
  onSubmit: (newValue: string) => void;
  isSubmitting: boolean;
}

export const TitleAndForm = ({title, onSubmit, isSubmitting}: TitleAndFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(title || '');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const handleSubmit = () => {
    if (!isEditMode) {
      return;
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return;
    }
    setIsEditMode(false);
    onSubmit(trimmedValue);
  }

  const handleCancel = () => {
    setIsEditMode(false);
    setValue(title || '');
  }

  const handleDoubleClick = () => {
    setIsEditMode(true);
  }

  return (
    <>
      {
        !isEditMode
          ? (
          <span className="text-gray-400" onDoubleClick={handleDoubleClick}>
            {value || 'Sin titulo'}
            <Edit className="inline-block w-4 h-4 ml-2 cursor-pointer hover:text-gray-600" onClick={handleDoubleClick} />
          </span>
          )
          : (<form>
          <div className="flex items-center justify-between mb-4 relative">
            <Input
              className="p-2 mr-4 flex-grow text-gray-500"
              type="text"
              placeholder="Ingrese el título"
              onChange={handleChange}
              value={value} />
            <div className="flex space-x-1 absolute right-3 top-11">
              <div className="flex items-center justify-center">
                {isSubmitting
                  ? <Loader2 className="inline-block w-4 h-4 mr-1 animate-spin text-green-500 hover:text-green-700 cursor-pointer "/>
                  : <Check className="inline-block w-4 h-4 mr-1 text-blue-500 hover:text-blue-700 cursor-pointer" onClick={handleSubmit}/>}
              </div>
              {handleCancel && (
                <div className="flex items-center justify-center">
                  <X
                    onClick={handleCancel}
                    className="inline-block w-4 h-4 mr-1 text-red-500 hover:text-red-700 cursor-pointer "/>
                </div>
              )}
            </div>
          </div>
        </form>)
      }
    </>
  );
}
