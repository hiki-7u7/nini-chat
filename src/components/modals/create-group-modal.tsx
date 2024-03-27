"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { Icons } from "@/components/icons";
import { Modal } from "@/components/ui/modal";
import { FileUpload } from "@/components/file-upload";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Group } from "@prisma/client";


const intialValuesState = {
  image: '',
  name: '',
  description: '',
}

export const CreateGroupModal = ({}) => {

  const { isOpen, type, onClose } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(intialValuesState);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const isModalOpen = isOpen && type === 'createGroup';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  };

  const handleChangeFile = (file: File | null) => {

    const fileReader = new FileReader();

    fileReader.onload = function() {
      setValues({...values, image: fileReader.result as string });
    };

    if(file){
      fileReader.readAsDataURL(file);
    } else {
      setValues({...values, image: '' });
    }

    setFile(file);

  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if(
      values.name.length === 0 || 
      values.description.length === 0 || 
      values.image.length === 0 ||
      !file
    ) return;
    
    const url = '/api/groups';
    
    setIsLoading(true);
  
    try {

      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('image', file);

      const { data } = await axios.post<Group>(url, formData);

      setValues(intialValuesState);
      handleClose();
      router.push(`/groups/${data.id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  };
  
  const handleClose = () => {
    onClose();
    setValues((prev) => {
      return {
        ...intialValuesState,
        imageUrl: prev.image
      }
    })
  };

  return (
    <Modal open={isModalOpen} onOpenChange={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="
        bg-[#212121]
        border-[1px]
        border-[hsl(0,0%,50%)]
        rounded-[5px]
        w-[400px]
        p-[15px]
        "
        >
        {/* HEADER */}
        <div>
          <div className="flex justify-between">
            <h2 
              className="
                text-xl
                font-semibold 
                text-white
              "
            >
              Crea un grupo
            </h2>
            <Icons.X
              onClick={handleClose} 
              className="
                text-[#808080] 
                hover:text-white 
                cursor-pointer
              "
            />
          </div>

          <p 
            className="
              mt-3
              text-sm 
              text-[#808080]
            "
          >Crea un grupo e invita a tus papus</p>
        </div>
      
      <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mt-6 flex flex-col gap-y-3">
            
            <FileUpload 
              isSubmiting={isLoading} 
              onChange={handleChangeFile} 
              imageValue={values.image}
            />

            <div className="flex flex-col gap-y-2">
              <label
                className="
                  text-[#808080]
                  font-semibold
                  text-sm
                "
                htmlFor="name"
              >
                Name
              </label>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                className="
                  bg-[#404040]
                  text-white
                  placeholder:text-[#808080]
                  focus:outline-none
                  rounded-[5px]
                  h-[35px]
                  px-[10px]
                  text-sm
                "
                type="text"
                placeholder="Name"
                id="name"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label
                className="
                  text-[#808080]
                  font-semibold
                  text-sm
                "
                htmlFor="description"
              >
                Description
              </label>
              <input
                onChange={handleChange}
                name={'description'}
                value={values.description}
                className="
                  bg-[#404040]
                  text-white
                  placeholder:text-[#808080]
                  focus:outline-none
                  rounded-[5px]
                  h-[35px]
                  px-[10px]
                  text-sm
                "
                type="text"
                placeholder="Description"
                id="description"
              />
            </div>
          </div>

        <div className="mt-8">
          <button
            disabled={isLoading}
            type="submit"
            className="
              w-full 
              bg-[hsl(0,0%,90%)]
              rounded-[5px]
              h-[35px]
              font-semibold
              hover:bg-[hsl(0,0%,70%)]
              disabled:cursor-not-allowed
              disabled:bg-[hsl(0,0%,70%)]
              flex
              items-center
              justify-center
            "
          >
            {isLoading 
              ? <Icons.Loader2 className="w-[20px] h-[20px] animate-spin"/>
              : "Create Group"
            }
          </button>
        </div>

      </form>


      </div>
    </Modal>
  )
}