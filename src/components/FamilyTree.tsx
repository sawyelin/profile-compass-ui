
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Plus, Edit, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo?: string;
  birthDate?: string;
  status: 'alive' | 'deceased';
  personalId?: string;
}

interface FamilyTreeProps {
  personId: string;
  familyMembers: {
    self: FamilyMember;
    spouse?: FamilyMember;
    children: FamilyMember[];
    parents: {
      father?: FamilyMember;
      mother?: FamilyMember;
    };
    grandparents: {
      paternalGrandfather?: FamilyMember;
      paternalGrandmother?: FamilyMember;
      maternalGrandfather?: FamilyMember;
      maternalGrandmother?: FamilyMember;
    };
    siblings: FamilyMember[];
  };
}

export function FamilyTree({ personId, familyMembers }: FamilyTreeProps) {
  const FamilyMemberCard = ({ member, size = 'default' }: { member: FamilyMember; size?: 'small' | 'default' }) => (
    <div className={`flex flex-col items-center space-y-2 p-3 rounded-xl smart-glass-card hover:scale-105 transition-all duration-300 ${
      size === 'small' ? 'w-24' : 'w-32'
    }`}>
      <Avatar className={size === 'small' ? 'h-12 w-12' : 'h-16 w-16'}>
        <AvatarImage src={member.photo} alt={member.name} />
        <AvatarFallback className="text-xs font-bold">{member.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className={`font-medium text-gray-900 dark:text-gray-100 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          {member.name}
        </p>
        <p className="text-xs text-muted-foreground">{member.relationship}</p>
        <Badge variant={member.status === 'alive' ? 'default' : 'secondary'} className="text-xs mt-1">
          {member.status}
        </Badge>
      </div>
      {member.personalId && (
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/person/${member.personalId}`} className="text-xs">
            View Profile
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Family Tree
          </h3>
          <p className="text-muted-foreground">Complete family relationship map</p>
        </div>
        <Button variant="outline" className="smart-button-secondary">
          <Edit className="mr-2 h-4 w-4" />
          Edit Family
        </Button>
      </div>

      {/* Grandparents Level */}
      <Card className="smart-glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Grandparents Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Paternal Grandparents */}
            <div className="space-y-4">
              <h4 className="font-semibold text-center text-muted-foreground">Paternal Side</h4>
              <div className="flex justify-center gap-4">
                {familyMembers.grandparents.paternalGrandfather && (
                  <FamilyMemberCard member={familyMembers.grandparents.paternalGrandfather} size="small" />
                )}
                {familyMembers.grandparents.paternalGrandmother && (
                  <FamilyMemberCard member={familyMembers.grandparents.paternalGrandmother} size="small" />
                )}
              </div>
            </div>

            {/* Maternal Grandparents */}
            <div className="space-y-4">
              <h4 className="font-semibold text-center text-muted-foreground">Maternal Side</h4>
              <div className="flex justify-center gap-4">
                {familyMembers.grandparents.maternalGrandfather && (
                  <FamilyMemberCard member={familyMembers.grandparents.maternalGrandfather} size="small" />
                )}
                {familyMembers.grandparents.maternalGrandmother && (
                  <FamilyMemberCard member={familyMembers.grandparents.maternalGrandmother} size="small" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents Level */}
      <Card className="smart-glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Parents Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-8">
            {familyMembers.parents.father && (
              <FamilyMemberCard member={familyMembers.parents.father} />
            )}
            {familyMembers.parents.mother && (
              <FamilyMemberCard member={familyMembers.parents.mother} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Generation */}
      <Card className="smart-glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Current Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-8">
            {/* Self */}
            <div className="relative">
              <FamilyMemberCard member={familyMembers.self} />
              <div className="absolute -top-2 -right-2">
                <Badge variant="default" className="text-xs">You</Badge>
              </div>
            </div>

            {/* Spouse */}
            {familyMembers.spouse && (
              <>
                <Heart className="h-6 w-6 text-red-500 animate-pulse" />
                <FamilyMemberCard member={familyMembers.spouse} />
              </>
            )}
          </div>

          {/* Siblings */}
          {familyMembers.siblings.length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="font-semibold text-center text-muted-foreground">Siblings</h4>
              <div className="flex justify-center gap-4 flex-wrap">
                {familyMembers.siblings.map(sibling => (
                  <FamilyMemberCard key={sibling.id} member={sibling} size="small" />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Children Level */}
      {familyMembers.children.length > 0 && (
        <Card className="smart-glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Next Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 flex-wrap">
              {familyMembers.children.map(child => (
                <FamilyMemberCard key={child.id} member={child} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Family Member */}
      <Card className="smart-glass-card border-2 border-dashed border-muted-foreground/30">
        <CardContent className="text-center py-8">
          <Button variant="outline" className="smart-button-secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Family Member
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Add parents, siblings, spouse, or children
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
