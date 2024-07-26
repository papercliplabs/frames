"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComponentProps, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { cn } from "@/utils/chadcn";
import Link from "next/link";
import { createPoll } from "../../data/poll";
import { useRouter } from "next/navigation";
import { MAX_OPTION_CHAR_LEN, MAX_QUESTION_CHAR_LEN, PreviewFrame } from "../../components/PreviewFrame";

const formSchema = z.object({
  question: z.string().min(8).max(MAX_QUESTION_CHAR_LEN),
  option1: z.string().min(1).max(MAX_OPTION_CHAR_LEN),
  option2: z.string().min(1).max(MAX_OPTION_CHAR_LEN),
  option3: z.string().min(0).max(MAX_OPTION_CHAR_LEN).optional(),
  option4: z.string().min(0).max(MAX_OPTION_CHAR_LEN).optional(),
});

export default function NounPollCreator() {
  const [numOptions, setNumOptions] = useState<number>(2);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    },
  });

  // Watch these for the preview
  const question = form.watch("question");
  const option1 = form.watch("option1");
  const option2 = form.watch("option2");
  const option3 = form.watch("option3");
  const option4 = form.watch("option4");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const pollId = await createPoll({
      question: values.question,
      option1: values.option1,
      option2: values.option2,
      option3: values.option3 != "" ? values.option3 : undefined,
      option4: values.option4 != "" ? values.option4 : undefined,
    });

    router.push(`/nounpoll/created/${pollId}`);
  }

  function removeOption(number: 3 | 4) {
    switch (number) {
      case 3:
        form.setValue("option3", "");
        setNumOptions(2);
        break;

      case 4:
        form.setValue("option4", "");
        setNumOptions(3);
        break;
    }
  }

  return (
    <div className="flex h-dvh w-screen flex-col-reverse gap-6 overflow-x-hidden pb-16 pt-4 md:gap-0 md:pb-0 md:pt-0 lg:flex-row">
      <div className="flex justify-center bg-white p-4 md:flex-1 md:shrink-0 md:pb-8 md:pt-[15vh]">
        <div className="relative flex max-w-[600px] flex-col gap-4 ">
          <div>
            <h1 className="text-[24px] font-semibold leading-[38.4px] tracking-[-0.02em]">Create a NounPoll</h1>
            <div className="text-[16px] font-light text-[#898989]">
              This will create a Farcaster Frame anonymous poll where votes are weighted by delegated Nouns to voters
              Farcaster account verified addresses.
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 lg:hidden">
            <div className="self-start text-[14px] font-semibold text-[#898989]">Preview</div>
            <PreviewFrame
              question={question}
              option1={option1}
              option2={option2}
              option3={numOptions >= 3 ? option3 : undefined}
              option4={numOptions >= 4 ? option4 : undefined}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-[14px] font-semibold text-[#898989]">Question</div>
                <FormFieldWrapper
                  control={form.control}
                  name="question"
                  placeholder="Enter your poll question..."
                  className="whitespace-pre-wrap"
                  type="textarea"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-[14px] font-semibold text-[#898989]">Options</div>
                <FormFieldWrapper control={form.control} name="option1" placeholder="Option 1" type="input" />
                <FormFieldWrapper control={form.control} name="option2" placeholder="Option 2" type="input" />

                {numOptions >= 3 && (
                  <div className="flex w-full">
                    <FormFieldWrapper
                      control={form.control}
                      name="option3"
                      placeholder="Option 3"
                      type="input"
                      className="w-full"
                    />
                    {numOptions == 3 && (
                      <button type="button" onClick={() => removeOption(3)} className="h-[48px] w-[48px] p-3">
                        <Trash2 size={24} stroke="#898989" />
                      </button>
                    )}
                  </div>
                )}

                {numOptions >= 4 && (
                  <div className="flex w-full">
                    <FormFieldWrapper control={form.control} name="option4" placeholder="Option 4" type="input" />
                    {numOptions == 4 && (
                      <button type="button" onClick={() => removeOption(4)} className="h-[48px] w-[48px] p-3">
                        <Trash2 size={24} stroke="#898989" />
                      </button>
                    )}
                  </div>
                )}

                {numOptions < 4 && (
                  <button
                    type="button"
                    onClick={() => setNumOptions(Math.min(numOptions + 1, 4))}
                    className="self-start pt-2 text-[16px] text-[#1A74FF]"
                  >
                    + Add option
                  </button>
                )}
              </div>

              <Button
                type="submit"
                className="h-[48px] rounded-xl text-[16px] font-medium shadow-sm"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating..." : "Create Poll"}
              </Button>
            </form>
          </Form>
          <div className="bottom-0 flex self-center justify-self-end whitespace-pre-wrap pt-4 text-[12px] text-[#898989] md:absolute">
            Made for Nouns by{" "}
            <Link href="https://paperclip.xyz" target="_blank" className="text-black">
              Paperclip Labs
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden shrink-0 items-center justify-center rounded-2xl md:flex-1 md:rounded-none md:bg-[#120D17] md:p-4 lg:flex">
        <PreviewFrame
          question={question}
          option1={option1}
          option2={option2}
          option3={numOptions >= 3 ? option3 : undefined}
          option4={numOptions >= 4 ? option4 : undefined}
        />
      </div>
    </div>
  );
}

function FormFieldWrapper({
  control,
  name,
  placeholder,
  type,
  className,
  ...props
}: { control: any; name: string; placeholder: string; type: "input" | "textarea" } & ComponentProps<typeof Input>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow">
          <FormControl>
            {type == "textarea" ? (
              <Textarea
                placeholder={placeholder}
                className="max-h-[200px] resize-none text-[16px] shadow-sm"
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                className={cn("h-[48px] text-[16px] shadow-sm", className)}
                {...props}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage className="text-[12px] font-normal" />
        </FormItem>
      )}
    />
  );
}
