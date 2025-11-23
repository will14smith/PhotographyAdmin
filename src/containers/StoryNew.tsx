import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading, TextField, TextAreaField } from "@aws-amplify/ui-react";
import { createStory } from "../api/story";
import LoaderButton from "../components/LoaderButton";

export default function StoryNew() {
  const navigate = useNavigate();
  const [storyTitle, setStoryTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await createStory({ StoryTitle: storyTitle, Journal: journal, StartDate: startDate, EndDate: endDate });
      navigate("/stories");
    } catch (e) {
      alert(e);
      setIsSaving(false);
    }
  }

  return (
    <div>
      <Heading level={1}>New Story</Heading>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
        />
        <TextAreaField
          label="Journal"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <LoaderButton type="submit" isLoading={isSaving} disabled={!storyTitle || !journal}>
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
