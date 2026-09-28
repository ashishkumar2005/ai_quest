export type QuizQuestionData = { prompt: string; type: "Multiple choice" | "True or false" | "Scenario"; options: string[]; answer: number; explanation: string };
export const quizQuestions: Record<number, QuizQuestionData[]> = {
  1: [
    {prompt:"Which stage comes first in the AI Project Cycle?",type:"Multiple choice",options:["Evaluation","Problem scoping","Modelling","Data exploration"],answer:1,explanation:"Problem scoping identifies the challenge and its context before collecting or exploring data."},
    {prompt:"A responsible AI system should consider who might be affected by its decisions.",type:"True or false",options:["True","False"],answer:0,explanation:"Thinking about affected people and communities is part of responsible, human-centred AI."},
    {prompt:"A school uses an AI tool to recommend activities. What should it do if recommendations may unfairly exclude some students?",type:"Scenario",options:["Ignore the issue if most results look right","Review the data and outcomes for bias","Collect more personal data from everyone","Hide how recommendations are made"],answer:1,explanation:"Reviewing representation and outcomes can reveal unfair patterns so the system can be improved."},
    {prompt:"Which principle helps people understand why an AI system made a decision?",type:"Multiple choice",options:["Transparency","Speed","Storage","Automation"],answer:0,explanation:"Transparency helps people understand and question a system's decisions."}
  ],
  2: [
    {prompt:"In supervised learning, training examples include…",type:"Multiple choice",options:["Labels or known answers","Only pictures","No examples","Random predictions"],answer:0,explanation:"Supervised learning learns from examples paired with labels or known outcomes."},
    {prompt:"Clustering can help find groups in data without pre-labelled answers.",type:"True or false",options:["True","False"],answer:0,explanation:"Clustering is an unsupervised approach for grouping similar examples."},
    {prompt:"A model performs well on its practice examples but poorly on new examples. What is the most likely issue?",type:"Scenario",options:["It generalises perfectly","It may have overfit its training data","It needs fewer examples always","The labels are no longer needed"],answer:1,explanation:"Overfitting happens when a model learns training details that do not generalise to new data."},
    {prompt:"What is one role of a neural network's weights?",type:"Multiple choice",options:["Store adjustable strengths of connections","Choose the school timetable","Create labels automatically in every case","Replace all data"],answer:0,explanation:"Weights adjust the strength of connections and are tuned as a network learns."}
  ],
  3: [
    {prompt:"Why keep test data separate from training data?",type:"Multiple choice",options:["To estimate performance on unseen examples","To make training slower","To remove all errors","To label the model"],answer:0,explanation:"A separate test set gives a more honest estimate of how well a model handles new data."},
    {prompt:"Accuracy alone is always the best metric for every problem.",type:"True or false",options:["True","False"],answer:1,explanation:"The right metric depends on the problem; precision and recall may matter more in some cases."},
    {prompt:"A filter flags suspicious messages. Missing a truly suspicious message is especially harmful. Which metric should you focus on?",type:"Scenario",options:["Recall","Screen brightness","File size","Training time"],answer:0,explanation:"Recall measures how many actual positive cases the system catches."},
    {prompt:"A confusion matrix compares…",type:"Multiple choice",options:["Predicted and actual labels","Two training datasets","Only model speed","Images and sound"],answer:0,explanation:"A confusion matrix shows how predicted classes compare with actual classes."}
  ],
  4: [
    {prompt:"Which measure is often less affected by an extreme outlier?",type:"Multiple choice",options:["Median","Mean","Range","Total"],answer:0,explanation:"The median is based on the middle value and is less influenced by extreme values than the mean."},
    {prompt:"A graph title and labelled axes help readers interpret data.",type:"True or false",options:["True","False"],answer:0,explanation:"Titles and labels make the quantities and context clear."},
    {prompt:"One unusually high value pulls the average upward. Which summary might better represent a typical value?",type:"Scenario",options:["Median","Maximum","Sum","Count"],answer:0,explanation:"The median is robust to an extreme high value and may better describe the middle of the data."},
    {prompt:"A data distribution describes…",type:"Multiple choice",options:["How values are spread and occur","Only the colour of a chart","The model's name","A list of predictions only"],answer:0,explanation:"A distribution describes the pattern, frequency and spread of values."}
  ],
  5: [
    {prompt:"A digital image is made up of small units called…",type:"Multiple choice",options:["Pixels","Paragraphs","Labels","Functions"],answer:0,explanation:"Pixels are the small picture elements that make up a digital image."},
    {prompt:"Object detection can identify and locate objects in an image.",type:"True or false",options:["True","False"],answer:0,explanation:"Object detection both classifies objects and locates them, often with bounding boxes."},
    {prompt:"A wildlife camera needs to count and locate animals in each photo. Which task best fits?",type:"Scenario",options:["Object detection","Text translation","Clustering sentences","Audio transcription"],answer:0,explanation:"Object detection can find and locate multiple animals within each image."},
    {prompt:"Image classification usually assigns…",type:"Multiple choice",options:["A label to an image","A sound to a video","A password to a camera","A chart to each pixel"],answer:0,explanation:"Image classification predicts a category or label for an image."}
  ],
  6: [
    {prompt:"NLP is a field of AI that works with…",type:"Multiple choice",options:["Human language","Only gears","Network cables","Screen pixels only"],answer:0,explanation:"Natural Language Processing helps computers work with human language."},
    {prompt:"A chatbot can use intent detection to infer what a person wants to do.",type:"True or false",options:["True","False"],answer:0,explanation:"Intent detection classifies the goal or request expressed in a message."},
    {prompt:"A shop wants to group reviews into positive and negative opinions. Which task is a good fit?",type:"Scenario",options:["Sentiment analysis","Object detection","Image cropping","Sorting by file size"],answer:0,explanation:"Sentiment analysis estimates the opinion or emotional tone expressed in text."},
    {prompt:"Breaking text into smaller units for processing is commonly called…",type:"Multiple choice",options:["Tokenisation","Regression","Cropping","Encryption"],answer:0,explanation:"Tokenisation splits text into manageable units such as words or subwords."}
  ],
  7: [
    {prompt:"Why use a function in Python?",type:"Multiple choice",options:["To organise reusable instructions","To make a screen larger","To delete every variable","To turn data into a picture automatically"],answer:0,explanation:"Functions group reusable instructions under a meaningful name."},
    {prompt:"A Python dictionary stores values using key-value pairs.",type:"True or false",options:["True","False"],answer:0,explanation:"Dictionaries associate keys with corresponding values."},
    {prompt:"You want to keep each student's name linked to their quiz score. Which structure is a natural choice?",type:"Scenario",options:["A dictionary","A comment","A single Boolean value","A print statement"],answer:0,explanation:"A dictionary can map each student name (key) to a score (value)."},
    {prompt:"In a Python for loop, the indented block is…",type:"Multiple choice",options:["Repeated for each item","Always skipped","A type of image","A dictionary key"],answer:0,explanation:"A for loop runs its indented body for each item in the collection."}
  ]
};
