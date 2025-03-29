"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>([""]);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/polls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, options }),
    });
    if (res.ok) {
      // On redirige vers la liste ou la page du sondage créé
      const data = await res.json();
      router.push(`/polls/${data.id}`);
    } else {
      // Gérer les erreurs
      console.error("Erreur lors de la création du sondage");
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Créer un nouveau sondage</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
              placeholder="Titre du sondage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
          />
          <Textarea
              placeholder="Description du sondage (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <p className="font-semibold mb-2">Options :</p>
            {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                  />
                  {index > 0 && (
                      <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeOption(index)}
                      >
                        Suppr
                      </Button>
                  )}
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addOption}>
              Ajouter une option
            </Button>
          </div>

          <Button type="submit" className="mt-4">
            Créer le sondage
          </Button>
        </form>
      </div>
  );
}
