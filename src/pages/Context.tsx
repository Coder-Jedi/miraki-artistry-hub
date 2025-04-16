
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import promptContext from '../agent-prompt-context.md?raw';
import projectContext from '../agent-project-context.md?raw';

const Context = () => {
  return (
    <Layout>
      <div className="container-fluid py-24">
        <h1 className="text-3xl font-bold mb-8">Project Context</h1>
        
        <Tabs defaultValue="prompt">
          <TabsList className="mb-4">
            <TabsTrigger value="prompt">Development Context</TabsTrigger>
            <TabsTrigger value="project">Project Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt">
            <Card>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {promptContext}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="project">
            <Card>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {projectContext}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Context;
